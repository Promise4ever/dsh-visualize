// src/storage-maintenance.ts
import { createHash } from "node:crypto";
import { lstat as lstat2, opendir, unlink as unlink2 } from "node:fs/promises";
import { basename, dirname as dirname2, join as join2, relative as relative2 } from "node:path";

// src/storage-safety.ts
import { constants } from "node:fs";
import { lstat, mkdir, open, rename, unlink } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
function isMissing(error) {
  return error?.code === "ENOENT";
}
function insidePath(root, target) {
  const rel = relative(root, target);
  return rel.length > 0 && rel !== ".." && !rel.startsWith(".." + sep) && !isAbsolute(rel);
}
async function assertPlainStorePath(root, target, allowMissing = false) {
  if (!isAbsolute(root) || !isAbsolute(target) || target !== root && !insidePath(root, target)) {
    throw new Error("visualization path escapes its store");
  }
  const parts = relative(root, target).split(sep).filter(Boolean);
  let current = root;
  for (let index = 0; index <= parts.length; index += 1) {
    if (index > 0) current = join(current, parts[index - 1]);
    let info;
    try {
      info = await lstat(current);
    } catch (error) {
      if (allowMissing && isMissing(error)) return;
      throw error;
    }
    if (info.isSymbolicLink() || (index < parts.length ? !info.isDirectory() : !info.isDirectory() && !info.isFile())) {
      throw new Error("visualization store links and special files are not allowed");
    }
    if (info.isFile() && info.nlink !== 1) throw new Error("visualization store hard links are not allowed");
  }
}
async function readPlainStoreText(root, path, maxBytes) {
  await assertPlainStorePath(root, path);
  const before = await lstat(path);
  if (!before.isFile() || before.size > maxBytes) throw new Error("visualization store file exceeds its size limit");
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const opened = await handle.stat();
    if (!opened.isFile() || opened.nlink !== 1 || before.ino !== opened.ino || before.dev !== opened.dev) {
      throw new Error("visualization store file changed while opening");
    }
    const bytes = Buffer.alloc(Math.min(opened.size + 1, maxBytes + 1));
    let offset = 0;
    for (; ; ) {
      const { bytesRead } = await handle.read(bytes, offset, bytes.length - offset, offset);
      offset += bytesRead;
      if (bytesRead === 0 || offset === bytes.length) break;
    }
    if (offset > maxBytes || offset !== opened.size) throw new Error("visualization store file changed while reading");
    const after = await handle.stat();
    if (after.size !== opened.size || after.mtimeMs !== opened.mtimeMs || after.ctimeMs !== opened.ctimeMs) {
      throw new Error("visualization store file changed while reading");
    }
    await assertPlainStorePath(root, path);
    return bytes.subarray(0, offset).toString("utf8");
  } finally {
    await handle.close();
  }
}
function checkedStoreRoot(root) {
  if (!isAbsolute(root)) throw new Error("visualization store root must be absolute");
  return resolve(root);
}

// src/storage-lock.ts
var MAX_LOCK_BYTES = 4096;
function parseCardLock(text, card) {
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    return void 0;
  }
  if (typeof value !== "object" || value === null) return void 0;
  const record = value;
  if (record["kind"] !== "dsh-visualize-lock" || record["version"] !== 1 || record["card"] !== card || typeof record["pid"] !== "number" || !Number.isSafeInteger(record["pid"]) || record["pid"] < 1 || record["pid"] > 2147483647 || typeof record["createdAt"] !== "number" || !Number.isSafeInteger(record["createdAt"]) || record["createdAt"] < 1 || typeof record["nonce"] !== "string" || !/^[0-9a-f]{32}$/u.test(record["nonce"])) return void 0;
  return { kind: "dsh-visualize-lock", version: 1, pid: record["pid"], createdAt: record["createdAt"], nonce: record["nonce"], card };
}

// src/storage-maintenance.ts
var TEMP_NAME = /^(.+\.html(?:\.meta\.json)?)\.([1-9][0-9]*)\.([0-9a-f]{12})\.tmp$/u;
var DEFAULT_MIN_AGE = 24 * 60 * 60 * 1e3;
function fingerprint(info) {
  return [info.dev, info.ino, info.size, info.mtimeMs, info.ctimeMs, info.nlink].join(":");
}
function processAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    const code = error.code;
    if (code === "ESRCH") return false;
    if (code === "EPERM") return true;
    throw error;
  }
}
async function exists(path) {
  try {
    await lstat2(path);
    return true;
  } catch (error) {
    if (isMissing(error)) return false;
    throw error;
  }
}
function validatedRoot(root) {
  const absolute = checkedStoreRoot(root);
  if (basename(absolute) !== "visualize" || absolute === dirname2(absolute)) {
    throw new Error("maintenance root must be the explicit visualize store directory");
  }
  return absolute;
}
async function inventoryCardStore(root, options = {}) {
  root = validatedRoot(root);
  const minTempAgeMs = options.minTempAgeMs ?? DEFAULT_MIN_AGE;
  const maxEntries = options.maxEntries ?? 1e4;
  const includeStaleLocks = options.includeStaleLocks === true;
  if (!Number.isSafeInteger(minTempAgeMs) || minTempAgeMs < 6e4) throw new Error("temporary retention must be at least one minute");
  if (!Number.isSafeInteger(maxEntries) || maxEntries < 1 || maxEntries > 1e5) throw new Error("invalid maintenance inventory limit");
  const entries = [];
  let complete = true;
  const now = Date.now();
  const inspect = async (directory, depth) => {
    await assertPlainStorePath(root, directory);
    const dir = await opendir(directory);
    for await (const entry of dir) {
      if (entries.length >= maxEntries) {
        complete = false;
        break;
      }
      const path = join2(directory, entry.name);
      const info = await lstat2(path);
      const relativePath = relative2(root, path).replaceAll("\\", "/");
      let kind = "other";
      let cleanupEligible = false;
      let reason;
      let lockOwner;
      if (info.isSymbolicLink()) kind = "symlink";
      else if (info.isDirectory()) kind = "directory";
      else if (info.isFile()) {
        if (entry.name.endsWith(".html")) kind = "card";
        else if (entry.name.endsWith(".html.meta.json")) kind = "metadata";
        else if (entry.name.endsWith(".html.lock")) {
          kind = "lock";
          if (depth !== 2) reason = "outside-session-card-directory";
          else if (info.nlink !== 1 || info.size > MAX_LOCK_BYTES) reason = "unknown-lock-format";
          else {
            const metadata = parseCardLock(await readPlainStoreText(root, path, MAX_LOCK_BYTES), entry.name.slice(0, -5));
            if (metadata === void 0) reason = "unknown-lock-format";
            else {
              const live = processAlive(metadata.pid);
              lockOwner = { pid: metadata.pid, createdAt: metadata.createdAt, nonce: metadata.nonce, status: live ? "live" : "dead" };
              if (live) reason = "owner-process-live";
              else if (now - info.mtimeMs < minTempAgeMs || now - metadata.createdAt < minTempAgeMs) reason = "recent-lock";
              else if (!includeStaleLocks) reason = "stale-lock-requires-explicit-recovery";
              else cleanupEligible = true;
            }
          }
        }
        const temporary = TEMP_NAME.exec(entry.name);
        if (temporary !== null) {
          kind = "temporary";
          const pid = Number(temporary[2]);
          const cardName = temporary[1].replace(/\.meta\.json$/u, "");
          if (depth !== 2) reason = "outside-session-card-directory";
          else if (info.nlink !== 1) reason = "hard-linked-file";
          else if (!Number.isSafeInteger(pid) || pid > 2147483647) reason = "invalid-owner-pid";
          else if (now - info.mtimeMs < minTempAgeMs) reason = "recent-temporary";
          else if (await exists(join2(directory, cardName + ".lock"))) reason = "card-lock-present";
          else if (processAlive(pid)) reason = "owner-process-live";
          else cleanupEligible = true;
        }
      }
      entries.push({
        path: relativePath,
        kind,
        size: info.size,
        modifiedAt: info.mtimeMs,
        fingerprint: fingerprint(info),
        cleanupEligible,
        ...reason === void 0 ? {} : { reason },
        ...lockOwner === void 0 ? {} : { lockOwner }
      });
      if (!info.isSymbolicLink() && info.isDirectory() && (depth === 0 && entry.name === "sessions" || depth === 1)) await inspect(path, depth + 1);
      if (!complete) break;
    }
  };
  try {
    await assertPlainStorePath(root, root);
  } catch (error) {
    if (!isMissing(error)) throw error;
    return { root, minTempAgeMs, includeStaleLocks, complete: true, entries, confirmationToken: token(root, minTempAgeMs, true, entries, includeStaleLocks) };
  }
  await inspect(root, 0);
  entries.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  return { root, minTempAgeMs, includeStaleLocks, complete, entries, confirmationToken: token(root, minTempAgeMs, complete, entries, includeStaleLocks) };
}
function token(root, retention, complete, entries, includeStaleLocks) {
  return createHash("sha256").update(JSON.stringify({ root, retention, complete, entries, includeStaleLocks })).digest("hex");
}
async function cleanupCardStoreTemps(root, options = {}) {
  const inventory = await inventoryCardStore(root, options);
  if (options.confirm === void 0) return { status: "dry-run", inventory, removed: [] };
  if (!inventory.complete) throw new Error("incomplete storage inventory cannot authorize cleanup");
  if (options.confirm !== inventory.confirmationToken) throw new Error("storage inventory changed or confirmation token is invalid; run dry-run again");
  const removed = [];
  for (const entry of inventory.entries.filter((item) => item.cleanupEligible)) {
    const path = join2(inventory.root, entry.path);
    try {
      await assertPlainStorePath(inventory.root, path);
      const current = await lstat2(path);
      if (!current.isFile() || current.nlink !== 1 || fingerprint(current) !== entry.fingerprint) {
        throw new Error("maintenance file changed after cleanup confirmation");
      }
      if (entry.kind === "lock") {
        const metadata = parseCardLock(await readPlainStoreText(inventory.root, path, MAX_LOCK_BYTES), basename(path).slice(0, -5));
        if (!inventory.includeStaleLocks || metadata === void 0 || entry.lockOwner === void 0 || metadata.nonce !== entry.lockOwner.nonce || metadata.pid !== entry.lockOwner.pid || processAlive(metadata.pid) || Date.now() - current.mtimeMs < inventory.minTempAgeMs || Date.now() - metadata.createdAt < inventory.minTempAgeMs) {
          throw new Error("owned lock became active or changed after cleanup confirmation");
        }
      } else {
        const name = TEMP_NAME.exec(basename(path));
        if (entry.kind !== "temporary" || name === null) throw new Error("not a recognized visualization temporary");
        const pid = Number(name[2]);
        if (Date.now() - current.mtimeMs < inventory.minTempAgeMs || processAlive(pid) || await exists(join2(dirname2(path), name[1].replace(/\.meta\.json$/u, "") + ".lock"))) {
          throw new Error("temporary file became active after cleanup confirmation");
        }
      }
      await unlink2(path);
      removed.push(entry.path);
    } catch (error) {
      if (removed.length === 0) throw error;
      return { status: "partial", inventory, removed, error: {
        code: error.code ?? "CLEANUP_CHANGED",
        message: error.message
      } };
    }
  }
  return { status: "completed", inventory, removed };
}

// src/maintenance-cli.ts
var args = process.argv.slice(2);
var allowed = /* @__PURE__ */ new Set(["--root", "--confirm", "--include-stale-locks", "--min-age-hours"]);
function option(name) {
  const at = args.indexOf(name);
  if (at < 0) return void 0;
  const value = args[at + 1];
  if (value === void 0 || value.startsWith("--")) throw new Error(name + " requires a value");
  return value;
}
async function main() {
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    if (!allowed.has(key)) throw new Error("Unknown option: " + key);
    if (key !== "--include-stale-locks") i += 1;
  }
  const root = option("--root");
  if (root === void 0) throw new Error("Pass --root with the explicit absolute visualize store path; default is dry-run");
  const confirm = option("--confirm");
  if (confirm !== void 0 && !/^[a-f0-9]{64}$/u.test(confirm)) throw new Error("Invalid confirmation token; run dry-run first");
  const hoursRaw = option("--min-age-hours");
  const minTempAgeMs = hoursRaw === void 0 ? void 0 : Number(hoursRaw) * 60 * 60 * 1e3;
  if (minTempAgeMs !== void 0 && (!Number.isSafeInteger(minTempAgeMs) || minTempAgeMs < 60 * 60 * 1e3)) throw new Error("Minimum age must be at least one hour");
  const result = await cleanupCardStoreTemps(root, {
    ...confirm === void 0 ? {} : { confirm },
    ...minTempAgeMs === void 0 ? {} : { minTempAgeMs },
    includeStaleLocks: args.includes("--include-stale-locks")
  });
  const counts = {};
  for (const entry of result.inventory.entries) counts[entry.kind] = (counts[entry.kind] ?? 0) + 1;
  console.log(JSON.stringify({
    status: result.status,
    root: result.inventory.root,
    complete: result.inventory.complete,
    preservedHistoricalCards: true,
    counts,
    candidates: result.inventory.entries.filter((entry) => entry.cleanupEligible),
    confirmationToken: result.inventory.confirmationToken,
    removed: result.removed,
    ...result.error ? { error: result.error } : {}
  }, null, 2));
  if (result.status === "partial") process.exitCode = 1;
}
main().catch((error) => {
  console.error("visualize maintenance: " + String(error));
  process.exitCode = 1;
});
