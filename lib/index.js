// src/index.ts
import z2 from "@deepseek-ai/schemastery";

// src/tool.ts
import { defineTool } from "@deepseek-ai/dsh-tools";

// src/storage.ts
import { createHash as createHash2, randomBytes as randomBytes3 } from "node:crypto";
import { access, lstat as lstat3, mkdir as mkdir2, readFile, realpath, rename as rename2, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname as dirname2, isAbsolute as isAbsolute2, join as join2, relative as relative2, resolve as resolve2, sep as sep2 } from "node:path";

// src/style.ts
var STYLE_IDS = ["whale", "editorial", "paper", "sketch", "terminal"];
var DEFAULT_STYLE = "whale";
var SYSTEM_SANS = "system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif";
function ld(light, dark) {
  return `light-dark(${light}, ${dark})`;
}
function series(pairs) {
  return Object.fromEntries(pairs.map(([light, dark], i) => [`series-${i + 1}`, ld(light, dark)]));
}
var GOOGLE_FONTS = "https://fonts.googleapis.com/css2?";
var STYLES = {
  whale: {
    id: "whale",
    label: "\u9CB8\u84DD \xB7 Whale (default)",
    // Everything comes from the host bridge and the stylesheet fallbacks.
    vars: {},
    chart: {}
  },
  editorial: {
    id: "editorial",
    label: "\u62A5\u520A \xB7 Editorial",
    vars: {
      "foreground": ld("#1a1a1a", "#f2efe9"),
      "muted-foreground": ld("#5f5f5f", "#a8a39b"),
      "card": ld("rgb(140 110 60 / 6%)", "rgb(255 235 205 / 5%)"),
      "border": ld("rgb(0 0 0 / 12%)", "rgb(255 255 255 / 14%)"),
      "primary": ld("#b24032", "#f07a62"),
      "primary-foreground": ld("#ffffff", "#151517"),
      ...series([
        ["#b24032", "#f07a62"],
        ["#28659d", "#78ade8"],
        ["#26826b", "#5eccab"],
        ["#a87810", "#e3b04b"],
        ["#7a4e8c", "#c395d2"],
        ["#6e6259", "#b2a696"]
      ]),
      "context": ld("#8a8a8a", "#6f6f6f"),
      "grid": ld("rgb(0 0 0 / 8%)", "rgb(255 255 255 / 9%)"),
      "axis": ld("rgb(26 26 26 / 60%)", "rgb(242 239 233 / 60%)"),
      "font-display": "'Source Serif 4', 'Noto Serif SC', 'Songti SC', serif",
      "font-sans": "'Libre Franklin', 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
      "radius": "2px"
    },
    fontHref: `${GOOGLE_FONTS}family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Libre+Franklin:wght@400;500;600&family=Noto+Serif+SC:wght@500;700&display=swap`,
    extraCss: "h1, h2, h3 { font-weight: 600; letter-spacing: -0.005em; }",
    chart: { pointRadius: 0, valueAxisLine: false }
  },
  paper: {
    id: "paper",
    label: "\u8BBA\u6587 \xB7 Paper",
    vars: {
      "foreground": ld("#111111", "#ececec"),
      "muted-foreground": ld("#555555", "#a6a6a6"),
      "card": ld("rgb(0 0 0 / 2.5%)", "rgb(255 255 255 / 4%)"),
      "border": ld("rgb(0 0 0 / 18%)", "rgb(255 255 255 / 18%)"),
      "primary": ld("#0072b2", "#58b6ed"),
      "primary-foreground": ld("#ffffff", "#111111"),
      ...series([
        ["#0072b2", "#58b6ed"],
        ["#d55e00", "#e8743b"],
        ["#0c9c67", "#35b67e"],
        ["#c774a4", "#da91bd"],
        ["#9d7d36", "#e69f00"],
        ["#3b3b3b", "#d0d0d0"]
      ]),
      "grid": ld("rgb(0 0 0 / 6%)", "rgb(255 255 255 / 7%)"),
      "grid-axes": "none",
      "axis": ld("rgb(17 17 17 / 70%)", "rgb(236 236 236 / 70%)"),
      "line-width": "1.5",
      "font-display": "'STIX Two Text', 'Noto Serif SC', 'Songti SC', serif",
      "font-sans": "'STIX Two Text', 'Noto Serif SC', 'Songti SC', serif",
      "radius": "2px"
    },
    fontHref: `${GOOGLE_FONTS}family=STIX+Two+Text:wght@400;500;600&family=Noto+Serif+SC:wght@400;600&display=swap`,
    chart: {
      pointRadius: 3,
      pointStyles: ["circle", "triangle", "rect", "rectRot", "crossRot", "star"],
      dashes: [[], [6, 3], [2, 2], [8, 3, 2, 3]]
    }
  },
  sketch: {
    id: "sketch",
    label: "\u624B\u7ED8 \xB7 Sketch",
    vars: {
      "foreground": ld("#1e1e1e", "#ececec"),
      "muted-foreground": ld("#5c5f66", "#a6a7ab"),
      "card": ld("rgb(250 176 5 / 9%)", "rgb(250 176 5 / 7%)"),
      "border": ld("rgb(30 30 30 / 35%)", "rgb(236 236 236 / 35%)"),
      "primary": ld("#2d71b7", "#74c0fc"),
      "primary-foreground": ld("#ffffff", "#1e1e1e"),
      ...series([
        ["#2d71b7", "#74c0fc"],
        ["#cb1913", "#ff8787"],
        ["#36a047", "#91ea91"],
        ["#7048e8", "#9775fa"],
        ["#e8590c", "#ffa94d"],
        ["#108f6c", "#55e6c6"]
      ]),
      "grid-axes": "none",
      "axis": ld("rgb(30 30 30 / 60%)", "rgb(236 236 236 / 60%)"),
      "line-width": "2.5",
      "font-display": "'Kalam', 'LXGW WenKai TC', 'Kaiti SC', 'STKaiti', cursive",
      "font-sans": "'Kalam', 'LXGW WenKai TC', 'Kaiti SC', 'STKaiti', cursive",
      "font-mono": "'LXGW WenKai Mono TC', ui-monospace, monospace",
      "font-size-base": "15px",
      "radius": "10px"
    },
    fontHref: `${GOOGLE_FONTS}family=Kalam:wght@400;700&family=LXGW+WenKai+TC:wght@400;700&family=LXGW+WenKai+Mono+TC:wght@400&display=swap`,
    // A hand-drawn card edge, and exact figures back in a legible sans.
    extraCss: `.card { border-width: 1.5px; border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; }
.viz-stat-value, table { font-family: ${SYSTEM_SANS}; }`,
    chart: { tension: 0.35, pointRadius: 0, axisWidth: 1.5 }
  },
  terminal: {
    id: "terminal",
    label: "\u7EC8\u7AEF \xB7 Terminal",
    vars: {
      "foreground": ld("#1f2328", "#d6dccf"),
      "muted-foreground": ld("#59636e", "#8f9a8c"),
      "card": ld("rgb(0 0 0 / 3.5%)", "rgb(50 216 135 / 5%)"),
      "border": ld("rgb(0 0 0 / 16%)", "rgb(214 220 207 / 16%)"),
      "primary": ld("#177a46", "#32d887"),
      "primary-foreground": ld("#ffffff", "#0d0f0d"),
      ...series([
        ["#1e9157", "#32d887"],
        ["#8c5e03", "#f2b33d"],
        ["#3a757f", "#8ac9d4"],
        ["#9b0b9e", "#e07ce0"],
        ["#cf222e", "#ff6b6b"],
        ["#0a50ae", "#79a8ff"]
      ]),
      "grid": ld("rgb(0 0 0 / 10%)", "rgb(214 220 207 / 10%)"),
      "grid-axes": "both",
      "grid-dash": "2 4",
      "line-width": "1.5",
      "font-display": "'JetBrains Mono', 'LXGW WenKai Mono TC', 'Sarasa Mono SC', ui-monospace, 'SF Mono', monospace",
      "font-sans": "'JetBrains Mono', 'LXGW WenKai Mono TC', 'Sarasa Mono SC', ui-monospace, 'SF Mono', monospace",
      "font-mono": "'JetBrains Mono', 'LXGW WenKai Mono TC', 'Sarasa Mono SC', ui-monospace, 'SF Mono', monospace",
      "font-size-base": "13px",
      "radius": "0px"
    },
    fontHref: `${GOOGLE_FONTS}family=JetBrains+Mono:wght@400;500;700&family=LXGW+WenKai+Mono+TC:wght@400;700&display=swap`,
    extraCss: "body { font-variant-numeric: tabular-nums; }",
    chart: { tension: 0, pointRadius: 2, pointStyles: ["rect"] }
  }
};
var PAGE_CONFIG_GLOBAL = "__DSH_VISUALIZE_CONFIG__";
var STYLE_FILES_PATH = "/api/dsh-visualize/style-files";
function styleIdFrom(value) {
  return typeof value === "string" && STYLE_IDS.includes(value) ? value : DEFAULT_STYLE;
}

// ../workspace/node_modules/fflate/esm/index.mjs
import { createRequire } from "module";
var require2 = createRequire("/");
var Worker;
try {
  Worker = require2("worker_threads").Worker;
} catch (e) {
}
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var gzs = function(d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8)
    err(6, "invalid gzip data");
  var flg = d[3];
  var st = 10;
  if (flg & 4)
    st += (d[10] | d[11] << 8) + 2;
  for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
    ;
  return st + (flg & 2);
};
var gzl = function(d) {
  var l = d.length;
  return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
};
function gunzipSync(data, opts) {
  var st = gzs(data);
  if (st + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}

// src/codec.ts
var MAX_META_FRAGMENT_BYTES = 4 * 1024 * 1024;
var MAX_META_GZIP_BYTES = MAX_META_FRAGMENT_BYTES;
var MAX_META_BASE64_CHARS = Math.ceil(MAX_META_GZIP_BYTES / 3) * 4;
function fragmentByteLength(value) {
  let bytes = 0;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 128) bytes += 1;
    else if (code < 2048) bytes += 2;
    else if (code >= 55296 && code <= 56319 && i + 1 < value.length && value.charCodeAt(i + 1) >= 56320 && value.charCodeAt(i + 1) <= 57343) {
      bytes += 4;
      i += 1;
    } else bytes += 3;
    if (bytes > MAX_META_FRAGMENT_BYTES) return bytes;
  }
  return bytes;
}
function decodeWireFragment(value) {
  try {
    if (typeof value === "string") {
      return value.length <= MAX_META_FRAGMENT_BYTES && fragmentByteLength(value) <= MAX_META_FRAGMENT_BYTES ? value : void 0;
    }
    if (typeof value !== "object" || value === null) return void 0;
    const envelope = value;
    if (envelope["encoding"] !== "gzip-base64" || typeof envelope["data"] !== "string") return void 0;
    const size = envelope["byteLength"];
    if (typeof size !== "number" || !Number.isSafeInteger(size) || size < 0 || size > MAX_META_FRAGMENT_BYTES) return void 0;
    const data = base64Bytes(envelope["data"]);
    if (data === void 0 || data.length < 20 || data[0] !== 31 || data[1] !== 139 || data[2] !== 8 || data[3] !== 0) return void 0;
    const trailer = new DataView(data.buffer, data.byteOffset + data.length - 8, 8);
    if (trailer.getUint32(4, true) !== size) return void 0;
    if (!validDeflateSize(data.subarray(10, -8), size)) return void 0;
    const output = gunzipSync(data, { out: new Uint8Array(size + 1) });
    if (output.length !== size || crc32(output) !== trailer.getUint32(0, true)) return void 0;
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(output);
  } catch {
    return void 0;
  }
}
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function base64Bytes(text) {
  if (text.length === 0 || text.length > MAX_META_BASE64_CHARS || text.length % 4 !== 0) return void 0;
  if (/[^A-Za-z0-9+/=]/u.test(text)) return void 0;
  const padding = text.endsWith("==") ? 2 : text.endsWith("=") ? 1 : 0;
  if (text.slice(0, text.length - padding).includes("=")) return void 0;
  const size = text.length / 4 * 3 - padding;
  if (size > MAX_META_GZIP_BYTES) return void 0;
  if (padding === 2 && (ALPHABET.indexOf(text[text.length - 3]) & 15) !== 0) return void 0;
  if (padding === 1 && (ALPHABET.indexOf(text[text.length - 2]) & 3) !== 0) return void 0;
  const bytes = new Uint8Array(size);
  let at = 0;
  for (let i = 0; i < text.length; i += 4) {
    const bits2 = ALPHABET.indexOf(text[i]) << 18 | ALPHABET.indexOf(text[i + 1]) << 12 | (text[i + 2] === "=" ? 0 : ALPHABET.indexOf(text[i + 2])) << 6 | (text[i + 3] === "=" ? 0 : ALPHABET.indexOf(text[i + 3]));
    bytes[at++] = bits2 >>> 16;
    if (at < size) bytes[at++] = bits2 >>> 8;
    if (at < size) bytes[at++] = bits2;
  }
  return bytes;
}
var CRC_TABLE = Uint32Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? 3988292384 ^ crc >>> 1 : crc >>> 1;
  return crc >>> 0;
});
function crc32(bytes) {
  let crc = 4294967295;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 255] ^ crc >>> 8;
  return (crc ^ 4294967295) >>> 0;
}
function huffman(lengths) {
  const max2 = Math.max(...lengths);
  if (max2 === 0 || max2 > 15) throw new Error("invalid huffman tree");
  const counts = new Uint16Array(16);
  for (const length of lengths) if (length > 0) counts[length] = counts[length] + 1;
  const next = new Uint16Array(16);
  let code = 0;
  for (let bits2 = 1; bits2 <= max2; bits2 += 1) {
    code = (code + counts[bits2 - 1]) * 2;
    if (code + counts[bits2] > 1 << bits2) throw new Error("oversubscribed huffman tree");
    next[bits2] = code;
  }
  const table = new Int32Array(1 << max2);
  for (let symbol = 0; symbol < lengths.length; symbol += 1) {
    const length = lengths[symbol];
    if (length === 0) continue;
    let reversed = 0;
    let canonical = next[length];
    next[length] = canonical + 1;
    for (let i = 0; i < length; i += 1) {
      reversed = reversed * 2 + (canonical & 1);
      canonical >>>= 1;
    }
    for (let index = reversed; index < table.length; index += 1 << length) table[index] = symbol << 5 | length;
  }
  return { table, bits: max2 };
}
var FIXED_LITERAL = huffman(Array.from({ length: 288 }, (_, i) => i < 144 ? 8 : i < 256 ? 9 : i < 280 ? 7 : 8));
var FIXED_DISTANCE = huffman(Array.from({ length: 32 }, () => 5));
var LENGTH_BASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
var LENGTH_EXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
var DISTANCE_BASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
var DISTANCE_EXTRA = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
var DYNAMIC_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
function validDeflateSize(data, expected) {
  let position = 0;
  let produced = 0;
  const read = (bits2) => {
    if (position + bits2 > data.length * 8) throw new Error("truncated deflate");
    const at = position >>> 3;
    const value = ((data[at] ?? 0) | (data[at + 1] ?? 0) << 8 | (data[at + 2] ?? 0) << 16) >>> (position & 7);
    position += bits2;
    return value & (1 << bits2) - 1;
  };
  const symbol = (tree) => {
    const at = position >>> 3;
    const value = ((data[at] ?? 0) | (data[at + 1] ?? 0) << 8 | (data[at + 2] ?? 0) << 16) >>> (position & 7);
    const entry = tree.table[value & (1 << tree.bits) - 1];
    const length = entry & 31;
    if (length === 0) throw new Error("invalid deflate code");
    read(length);
    return entry >>> 5;
  };
  let final = 0;
  do {
    final = read(1);
    const type = read(2);
    if (type === 0) {
      position = Math.ceil(position / 8) * 8;
      const size = read(16);
      if ((size ^ read(16)) !== 65535 || produced + size > expected) return false;
      position += size * 8;
      if (position > data.length * 8) return false;
      produced += size;
      continue;
    }
    if (type === 3) return false;
    let literal = FIXED_LITERAL;
    let distance = FIXED_DISTANCE;
    if (type === 2) {
      const literals = read(5) + 257;
      const distances = read(5) + 1;
      const codes = read(4) + 4;
      if (literals > 286) return false;
      const lengths = Array.from({ length: 19 }, () => 0);
      for (let i = 0; i < codes; i += 1) lengths[DYNAMIC_ORDER[i]] = read(3);
      const tree = huffman(lengths);
      const values = [];
      while (values.length < literals + distances) {
        const value = symbol(tree);
        if (value < 16) values.push(value);
        else {
          if (value === 16 && values.length === 0) return false;
          const count = value === 16 ? read(2) + 3 : value === 17 ? read(3) + 3 : read(7) + 11;
          if (values.length + count > literals + distances) return false;
          const repeated = value === 16 ? values[values.length - 1] : 0;
          for (let i = 0; i < count; i += 1) values.push(repeated);
        }
      }
      if (!values[256]) return false;
      literal = huffman(values.slice(0, literals));
      const distanceLengths = values.slice(literals);
      distance = distanceLengths.some(Boolean) ? huffman(distanceLengths) : { table: new Int32Array(1), bits: 0 };
    }
    for (; ; ) {
      const value = symbol(literal);
      if (value === 256) break;
      if (value < 256) produced += 1;
      else {
        if (value > 285) return false;
        const index = value - 257;
        const length = LENGTH_BASE[index] + read(LENGTH_EXTRA[index]);
        const dist = symbol(distance);
        if (dist > 29 || DISTANCE_BASE[dist] + read(DISTANCE_EXTRA[dist]) > produced) return false;
        produced += length;
      }
      if (produced > expected) return false;
    }
  } while (final === 0);
  return produced === expected && Math.ceil(position / 8) === data.length;
}

// src/fragment.ts
var VISUALIZE_TOOL_NAME = "visualize";
var VISUALIZE_MODES = ["inline", "wide", "page"];
function isVisualizeMode(value) {
  return value === "inline" || value === "wide" || value === "page";
}
var CARD_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
var IMAGE_ROUTE_PATH = "/api/dsh-visualize/image";
var PATCH_CONTEXT_CHARS = 160;
var MIN_ANCHOR_CHARS = 12;
function applyFragmentPatch(base, oldStr, newStr) {
  if (oldStr.length === 0) {
    throw new Error("invalid visualization patch: old_str is empty \u2014 pass the exact card text to replace");
  }
  const first = base.indexOf(oldStr);
  if (first === -1) {
    throw new Error(`invalid visualization patch: old_str does not appear in the card. ${nearestAnchor(base, oldStr)}`);
  }
  if (base.indexOf(oldStr, first + oldStr.length) !== -1) {
    throw new Error(
      `invalid visualization patch: old_str appears ${countOccurrences(base, oldStr)} times in the card \u2014 extend it with neighbouring lines until exactly one site matches`
    );
  }
  return base.slice(0, first) + newStr + base.slice(first + oldStr.length);
}
function nearestAnchor(base, oldStr) {
  let matched = 0;
  let beyond = oldStr.length;
  while (matched < beyond) {
    const mid = Math.ceil((matched + beyond) / 2);
    if (base.includes(oldStr.slice(0, mid))) matched = mid;
    else beyond = mid - 1;
  }
  if (matched < MIN_ANCHOR_CHARS) {
    return "None of it matched, so the card is not in the state you assumed \u2014 re-render the whole card instead.";
  }
  const at = base.indexOf(oldStr.slice(0, matched));
  return `Its first ${matched} characters do match, at offset ${at}, where the card actually reads ${JSON.stringify(base.slice(at, at + PATCH_CONTEXT_CHARS))} \u2014 correct old_str against that and retry.`;
}
function countOccurrences(base, needle) {
  let count = 0;
  for (let at = base.indexOf(needle); at !== -1; at = base.indexOf(needle, at + needle.length)) count += 1;
  return count;
}
function visualizeMetaFrom(meta) {
  if (typeof meta !== "object" || meta === null) return void 0;
  const record = meta;
  if (record["kind"] !== "visualize") return void 0;
  const { fragment: encoded, title, mode, path, summary } = record;
  const fragment = decodeWireFragment(encoded);
  if (fragment === void 0 || typeof title !== "string" || typeof path !== "string") return void 0;
  if (!isVisualizeMode(mode)) return void 0;
  return {
    kind: "visualize",
    fragment,
    title,
    mode,
    path,
    ...summaryField(summary),
    style: styleIdFrom(record["style"]),
    ...imagesField(record["images"])
  };
}
function imagesField(images) {
  if (!Array.isArray(images)) return {};
  const list = images.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { src, id, type, bytes } = entry;
    if (typeof src !== "string" || typeof id !== "string" || typeof bytes !== "number") return [];
    if (!CARD_IMAGE_TYPES.includes(type)) return [];
    return [{ src, id, type, bytes }];
  });
  return list.length > 0 ? { images: list } : {};
}
function summaryField(summary) {
  return typeof summary === "string" && summary.trim().length > 0 ? { summary: summary.trim() } : {};
}

// src/owned-storage.ts
import { createHash } from "node:crypto";
import { lstat as lstat2, open as open2, unlink as unlink2 } from "node:fs/promises";
import { basename } from "node:path";

// src/storage-lock.ts
import { randomBytes } from "node:crypto";
var MAX_LOCK_BYTES = 4096;
function newCardLock(card) {
  return { kind: "dsh-visualize-lock", version: 1, pid: process.pid, createdAt: Date.now(), nonce: randomBytes(16).toString("hex"), card };
}
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

// src/storage-safety.ts
import { constants } from "node:fs";
import { lstat, mkdir, open, rename, unlink } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { randomBytes as randomBytes2 } from "node:crypto";
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
async function ensureStoreParent(root, target) {
  await assertPlainStorePath(root, target, true);
  await mkdir(dirname(target), { recursive: true, mode: 448 });
  await assertPlainStorePath(root, target, true);
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
async function writePlainStoreText(root, path, content) {
  await ensureStoreParent(root, path);
  const temp = path + "." + process.pid + "." + randomBytes2(6).toString("hex") + ".tmp";
  let created = false;
  try {
    const handle = await open(temp, "wx", 384);
    created = true;
    try {
      await handle.writeFile(content, "utf8");
    } finally {
      await handle.close();
    }
    await assertPlainStorePath(root, path, true);
    await assertPlainStorePath(root, temp);
    await rename(temp, path);
  } finally {
    if (created) {
      try {
        await assertPlainStorePath(root, temp);
        await unlink(temp);
      } catch (error) {
        if (!isMissing(error)) throw error;
      }
    }
  }
}
function checkedStoreRoot(root) {
  if (!isAbsolute(root)) throw new Error("visualization store root must be absolute");
  return resolve(root);
}

// src/owned-storage.ts
var CARD_METADATA_SUFFIX = ".meta.json";
var MAX_SIDECAR_BYTES = 16 * 1024;
var QUEUES = /* @__PURE__ */ new Map();
function cardContentHash(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}
function propertiesFrom(value) {
  if (typeof value !== "object" || value === null) return void 0;
  const record = value;
  if (typeof record["title"] !== "string" || record["title"].length > 4096 || !isVisualizeMode(record["mode"]) || !STYLE_IDS.includes(record["style"]) || record["summary"] !== void 0 && (typeof record["summary"] !== "string" || record["summary"].length > 200)) return void 0;
  return {
    title: record["title"],
    mode: record["mode"],
    style: record["style"],
    ...record["summary"] === void 0 ? {} : { summary: record["summary"] }
  };
}
async function readOwnedMetadata(root, path, content) {
  let text;
  try {
    text = await readPlainStoreText(root, path + CARD_METADATA_SUFFIX, MAX_SIDECAR_BYTES);
  } catch (error) {
    if (isMissing(error)) return void 0;
    throw error;
  }
  let record;
  try {
    record = JSON.parse(text);
  } catch {
    return void 0;
  }
  if (typeof record !== "object" || record === null || record["version"] !== 1 || record["contentHash"] !== cardContentHash(content)) return void 0;
  return propertiesFrom(record);
}
async function locked(root, path, run) {
  const previous = QUEUES.get(path) ?? Promise.resolve();
  let release;
  const next = new Promise((resolve4) => {
    release = resolve4;
  });
  QUEUES.set(path, next);
  await previous;
  const lockPath = path + ".lock";
  let lock;
  const owner = newCardLock(basename(path));
  let lockWritten = false;
  try {
    await ensureStoreParent(root, path);
    try {
      lock = await open2(lockPath, "wx", 384);
    } catch (error) {
      if (error.code === "EEXIST") {
        throw Object.assign(new Error("visualization card is locked; inspect inventoryCardStore and explicitly confirm stale owned-lock recovery if its process has exited"), { code: "EEXIST" });
      }
      throw error;
    }
    await lock.writeFile(JSON.stringify(owner), "utf8");
    lockWritten = true;
    return await run();
  } finally {
    try {
      if (lock !== void 0) {
        const held = await lock.stat();
        await lock.close();
        await assertPlainStorePath(root, lockPath);
        const current = await lstat2(lockPath);
        if (held.ino !== current.ino || held.dev !== current.dev) throw new Error("visualization card lock changed");
        if (lockWritten) {
          const metadata = parseCardLock(await readPlainStoreText(root, lockPath, MAX_LOCK_BYTES), owner.card);
          if (metadata?.nonce !== owner.nonce) throw new Error("visualization card lock owner changed");
        }
        await unlink2(lockPath);
      }
    } finally {
      release();
      if (QUEUES.get(path) === next) QUEUES.delete(path);
    }
  }
}
async function writeOwnedCard(root, path, content, properties, expectedContent) {
  if (Buffer.byteLength(content, "utf8") > MAX_META_FRAGMENT_BYTES) throw new Error("visualization exceeds the 4 MiB replay limit");
  const normalized = properties === void 0 ? void 0 : propertiesFrom(properties);
  if (properties !== void 0 && normalized === void 0) throw new Error("invalid visualization card attributes");
  await locked(root, path, async () => {
    let current;
    try {
      current = await readPlainStoreText(root, path, MAX_META_FRAGMENT_BYTES);
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    if (expectedContent !== void 0 && current !== expectedContent) throw new Error("visualization card changed since it was read; read it again before patching");
    if (expectedContent === void 0 && current !== void 0 && current !== content) {
      throw new Error("visualization create would overwrite an existing card; create a new card identity instead");
    }
    const sidecar = path + CARD_METADATA_SUFFIX;
    let previousMetadata;
    try {
      previousMetadata = await readPlainStoreText(root, sidecar, MAX_SIDECAR_BYTES);
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    const metadata = normalized === void 0 ? void 0 : JSON.stringify({ version: 1, contentHash: cardContentHash(content), ...normalized });
    if (metadata !== void 0 && Buffer.byteLength(metadata, "utf8") > MAX_SIDECAR_BYTES) throw new Error("visualization attributes exceed their size limit");
    if (metadata !== void 0) await writePlainStoreText(root, sidecar, metadata);
    try {
      if (expectedContent !== void 0) {
        const latest = await readPlainStoreText(root, path, MAX_META_FRAGMENT_BYTES);
        if (latest !== expectedContent) throw new Error("visualization card changed during patch; no content was written");
      }
      await writePlainStoreText(root, path, content);
    } catch (error) {
      if (metadata !== void 0) {
        try {
          if (previousMetadata !== void 0) await writePlainStoreText(root, sidecar, previousMetadata);
          else {
            await assertPlainStorePath(root, sidecar);
            await unlink2(sidecar);
          }
        } catch (rollback) {
          throw new AggregateError([error, rollback], "visualization write failed and metadata rollback failed; content hash prevents stale attributes");
        }
      }
      throw error;
    }
  });
}

// src/storage.ts
var STORE_DIR = "visualize";
function cardStore(ctx, exec) {
  const root = storeRoot(ctx);
  const sessionId = exec.agent?.session.id;
  const workspace = workspaceFiles(ctx, exec);
  return {
    async create(name2) {
      if (root === void 0 || typeof sessionId !== "string" || sessionId.length === 0) {
        return await workspace.open(`viz/${name2}`);
      }
      return ownedFile(root, join2(root, "sessions", sessionSegment(sessionId), name2));
    },
    images: root === void 0 || typeof sessionId !== "string" || sessionId.length === 0 ? void 0 : sessionImages(root, sessionSegment(sessionId)),
    workspaceRoot: workspace.root,
    async open(path) {
      const owned = root === void 0 ? void 0 : await ownedPath(root, path);
      if (owned !== void 0) return ownedFile(root, owned);
      const legacy = await workspacePath(workspace.root, path);
      if (legacy === void 0) {
        throw new Error(
          `invalid visualization patch: ${JSON.stringify(path)} is not a card visualize can patch \u2014 pass the path a visualize call reported (a card in the session store, or a legacy viz/ .html copy inside the workspace)`
        );
      }
      return await workspace.open(legacy);
    }
  };
}
async function workspacePath(root, path) {
  if (root === void 0 || !isAbsolute2(root)) return void 0;
  const tilde = path === "~" || path.startsWith("~/");
  const expanded = tilde ? join2(homedir(), path.slice(1)) : path;
  const base = resolve2(root);
  const target = resolve2(base, expanded);
  if (!inside(base, target) || !target.endsWith(".html")) return void 0;
  const realRoot = await realpath(base).catch(() => base);
  if (!inside(realRoot, await realpathOfDeepest(target))) return void 0;
  return tilde || isAbsolute2(path) ? target : path;
}
async function realpathOfDeepest(target) {
  let existing = target;
  for (; ; ) {
    try {
      return join2(await realpath(existing), relative2(existing, target));
    } catch {
      const parent = dirname2(existing);
      if (parent === existing) return target;
      existing = parent;
    }
  }
}
function storeRoot(ctx) {
  let homePath;
  try {
    homePath = ctx.get("dshHomePath");
  } catch {
    return void 0;
  }
  if (typeof homePath !== "function") return void 0;
  const root = homePath(STORE_DIR);
  return typeof root === "string" && isAbsolute2(root) ? resolve2(root) : void 0;
}
function sessionSegment(id) {
  return Array.from(id, (char) => /^[A-Za-z0-9_-]$/u.test(char) ? char : `~${char.codePointAt(0).toString(16).padStart(4, "0")}`).join("");
}
async function ownedPath(root, path) {
  const expanded = path === "~" || path.startsWith("~/") ? join2(homedir(), path.slice(1)) : path;
  if (!isAbsolute2(expanded)) return void 0;
  const target = resolve2(expanded);
  if (!inside(root, target) || !target.endsWith(".html")) return void 0;
  const real = await realpath(target).catch(async () => await realpath(dirname2(target)).then(
    (parent) => join2(parent, "card.html"),
    () => void 0
  ));
  if (real === void 0) return target;
  const realRoot = await realpath(root).catch(() => root);
  return inside(realRoot, real) ? target : void 0;
}
function inside(root, target) {
  const rel = relative2(root, target);
  return rel.length > 0 && !rel.startsWith(`..${sep2}`) && rel !== ".." && !isAbsolute2(rel);
}
function ownedFile(root, path) {
  return {
    displayPath: displayOf(path),
    read: async () => await readFile(path, "utf8"),
    readMetadata: async (content) => await readOwnedMetadata(root, path, content),
    write: async (content, properties, expectedContent) => await writeOwnedCard(root, path, content, properties, expectedContent),
    images: manifestAt(`${path.slice(0, -".html".length)}.images.json`)
  };
}
var IMAGE_DIR = "images";
var IMAGE_EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg"
};
var IMAGE_ID = /^([A-Za-z0-9_~-]+)\/([0-9a-f]{64})\.(png|jpg|gif|webp|svg)$/u;
function imagePath(root, id) {
  const m = IMAGE_ID.exec(id);
  return m === null ? void 0 : join2(root, "sessions", m[1], IMAGE_DIR, `${m[2]}.${m[3]}`);
}
function sessionImages(root, segment) {
  return {
    async put(data, type) {
      const id = `${segment}/${createHash2("sha256").update(data).digest("hex")}.${IMAGE_EXTENSIONS[type]}`;
      const path = imagePath(root, id);
      if (!await exists(path)) await writeFileAtomic(path, data);
      return id;
    },
    async exists(id) {
      const path = imagePath(root, id);
      return path !== void 0 && await exists(path);
    }
  };
}
async function exists(path) {
  return await access(path).then(() => true, () => false);
}
function manifestAt(path) {
  return {
    async read() {
      let parsed;
      try {
        parsed = JSON.parse(await readFile(path, "utf8"));
      } catch {
        return [];
      }
      if (!Array.isArray(parsed)) return [];
      return parsed.flatMap((entry) => {
        if (typeof entry !== "object" || entry === null) return [];
        const { src, id, type, bytes, origin } = entry;
        if (typeof src !== "string" || typeof id !== "string" || IMAGE_ID.exec(id) === null) return [];
        if (typeof bytes !== "number" || !CARD_IMAGE_TYPES.includes(type) || origin !== "url" && origin !== "file") return [];
        return [{ src, id, type, bytes, origin }];
      });
    },
    async write(images) {
      if (images.length === 0) await rm(path, { force: true });
      else await writeFileAtomic(path, JSON.stringify(images));
    }
  };
}
async function readStoredImage(root, id) {
  if (root === void 0) return void 0;
  const path = imagePath(root, id);
  if (path === void 0) return void 0;
  const stat = await lstat3(path).catch(() => void 0);
  if (stat === void 0 || !stat.isFile()) return void 0;
  const realRoot = await realpath(root).catch(() => root);
  const real = await realpath(path).catch(() => void 0);
  if (real === void 0 || !inside(realRoot, real)) return void 0;
  const data = await readFile(real).catch(() => void 0);
  if (data === void 0) return void 0;
  const digest = createHash2("sha256").update(data).digest("hex");
  return digest === IMAGE_ID.exec(id)[2] ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : void 0;
}
async function handleImageRequest(root, request) {
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("method not allowed", { status: 405 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const data = await readStoredImage(root, id);
  if (data === void 0) return new Response("not found", { status: 404, headers: { "cache-control": "no-store" } });
  return new Response(request.method === "HEAD" ? null : data, {
    status: 200,
    headers: {
      "content-type": "application/octet-stream",
      "content-length": String(data.byteLength),
      "content-disposition": "attachment",
      "content-security-policy": "default-src 'none'; sandbox",
      "x-content-type-options": "nosniff",
      // Content-addressed, so a cached copy can never go stale.
      "cache-control": "private, max-age=31536000, immutable"
    }
  });
}
async function writeFileAtomic(path, content) {
  await mkdir2(dirname2(path), { recursive: true, mode: 448 });
  const temp = `${path}.${process.pid}.${randomBytes3(6).toString("hex")}.tmp`;
  try {
    await writeFile(temp, content, { encoding: "utf8", mode: 384, flag: "wx" });
    await rename2(temp, path);
  } catch (error) {
    if (error.code !== "EEXIST") await rm(temp, { force: true }).catch(() => {
    });
    throw error;
  }
}
function displayOf(path) {
  const home = homedir();
  return path.startsWith(`${home}${sep2}`) ? `~${path.slice(home.length)}` : path;
}
function workspaceFiles(ctx, exec) {
  const sandboxPolicy = ctx.get("sandboxPolicy")?.resolve({
    ...exec.agent ? { session: exec.agent.session } : {}
  });
  const cwd = sandboxPolicy?.workspaceRoot ?? exec.agent?.session.header.cwd;
  const resolveOpts = { ...cwd !== void 0 ? { cwd } : {}, signal: exec.signal };
  return {
    root: cwd,
    async open(path) {
      const target = await ctx.fs.resolve(path, resolveOpts);
      return {
        displayPath: target.displayPath,
        read: async () => await ctx.fs.readText(target, exec.signal),
        readMetadata: async () => void 0,
        async write(content) {
          await ctx.fs.writeText(target, content, void 0, exec.signal, sandboxPolicy);
        }
      };
    }
  };
}

// src/meta-encoder.ts
import { gzipSync } from "node:zlib";
function encodeWireFragment(fragment) {
  const bytes = Buffer.from(fragment, "utf8");
  if (bytes.byteLength > MAX_META_FRAGMENT_BYTES) throw new Error("visualization exceeds the 4 MiB replay limit");
  if (bytes.length < 8192 || bytes.toString("utf8") !== fragment) return fragment;
  const compressed = gzipSync(bytes, { level: 6 });
  if (compressed.byteLength > MAX_META_GZIP_BYTES) return fragment;
  const envelope = { encoding: "gzip-base64", data: compressed.toString("base64"), byteLength: bytes.byteLength };
  const rawSize = Buffer.byteLength(JSON.stringify(fragment), "utf8");
  const encodedSize = Buffer.byteLength(JSON.stringify(envelope), "utf8");
  return encodedSize + Math.max(64, Math.ceil(rawSize * 0.05)) < rawSize ? envelope : fragment;
}

// src/images.ts
import { lookup as dnsLookup } from "node:dns";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { BlockList, isIP } from "node:net";
import { resolve as resolvePath } from "node:path";

// src/viz-helper.ts
var CARD_STATE_MAX_CHARS = 16 * 1024;

// src/shell.ts
var RESOURCE_ORIGINS = [
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://esm.sh",
  "https://fonts.bunny.net",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://unpkg.com"
];
var RESOURCE_SOURCES = ["blob:", "data:", ...RESOURCE_ORIGINS].join(" ");
var FRAME_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${RESOURCE_SOURCES}`,
  `style-src 'unsafe-inline' ${RESOURCE_SOURCES}`,
  `img-src ${RESOURCE_SOURCES}`,
  `font-src ${RESOURCE_SOURCES}`,
  `media-src ${RESOURCE_SOURCES}`,
  "worker-src blob:",
  "connect-src blob: data:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'"
].join("; ");

// src/lint.ts
var ALLOWED_HOSTS = RESOURCE_ORIGINS.map((origin) => origin.slice("https://".length));
var HOST_LIST = ALLOWED_HOSTS.join(", ");
var LINT_RULES = {
  VZ001: {
    severity: "error",
    message: "the fragment is empty",
    fix: "pass the visualization markup itself in `fragment`"
  },
  VZ002: {
    severity: "error",
    message: "the fragment is over the size limit",
    fix: "shrink the inline data first (fewer rows, coarser buckets, fewer decimals, no unused fields)"
  },
  VZ003: {
    severity: "error",
    message: "the fragment contains a document-skeleton tag",
    fix: "write only the inline body; the host supplies <!doctype>, <html>, <head>, and <body>"
  },
  VZ004: {
    severity: "error",
    message: 'the markup is string-escaped (literal \\" or \\n where real quotes and line breaks belong)',
    fix: 'send the markup itself, with real " quotes and real line breaks, not a JSON-escaped rendition of it'
  },
  VZ005: {
    severity: "error",
    message: "external resource the card blocks",
    fix: `load it over https from an allowlisted host (${HOST_LIST}), or inline it`
  },
  VZ006: {
    severity: "error",
    message: "CDN resource without a pinned version",
    fix: "pin an exact version in the URL, e.g. https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"
  },
  VZ007: {
    severity: "error",
    message: "network API, blocked inside the card (it fails without an error message)",
    fix: "inline the data in the script as a literal, reduced first; the card cannot reach any server"
  },
  VZ008: {
    severity: "error",
    message: "form submission, blocked inside the card",
    fix: "drop action/method/formaction and handle the input in a submit listener that calls event.preventDefault()"
  },
  VZ009: {
    severity: "error",
    message: "declares color-scheme, which flips every light-dark() against the host theme",
    fix: "delete the color-scheme declaration; the card document already carries the host scheme"
  },
  VZ010: {
    severity: "error",
    message: "document.currentScript is used to locate the root",
    fix: "give the root element a unique id and find it with document.getElementById(...)"
  },
  VZ011: {
    severity: "error",
    message: "image from a host the card blocks",
    fix: 'write data-viz-src="<the same URL>" instead of src; the tool fetches the image and embeds it in the card'
  },
  VZ101: {
    severity: "warn",
    message: "hard-coded colour, which ignores the host theme",
    fix: "use a theme variable (var(--foreground), var(--viz-series-1), \u2026) or a light-dark(<light>, <dark>) pair; for canvas, resolve the variable through a probe element"
  },
  VZ102: {
    severity: "warn",
    message: "the script looks up an id no element in the fragment has",
    fix: "add that id to the element, or correct the lookup"
  },
  VZ103: {
    severity: "warn",
    message: "no element has an id for the script to find its root by",
    fix: "give the root element a unique id and find it with document.getElementById(...)"
  },
  VZ104: {
    severity: "warn",
    message: "Chart.defaults.font.family = 'inherit' is not a canvas font, so chart text falls back to the browser default",
    fix: "call dshViz.chartDefaults(Chart, root), which sets the card style's computed font, or set Chart.defaults.font.family = getComputedStyle(document.body).fontFamily"
  },
  VZ105: {
    severity: "warn",
    message: "CDN version is a range or partial version, so the build can change under the card",
    fix: "pin the exact major.minor.patch version"
  },
  VZ106: {
    severity: "warn",
    message: "relative or bare URL, which cannot resolve inside the sandboxed card",
    fix: "use a full https URL on an allowlisted host, or inline the resource (data: URLs work)"
  },
  VZ107: {
    severity: "warn",
    message: "relative image path, which cannot resolve inside the sandboxed card",
    fix: 'for a workspace file write data-viz-src="<path relative to the workspace root>" instead of src; the tool reads the file and embeds it in the card'
  },
  VZ108: {
    severity: "warn",
    message: "browser storage, which throws inside the sandboxed card and stops the script",
    fix: "keep control values with data-viz-keep and other choices with dshViz.state.set(key, value) / dshViz.state.get(key, fallback)"
  },
  VZ199: {
    severity: "warn",
    message: "a lint stage failed and was skipped, so its rules were not checked",
    fix: "nothing to change for this warning; check the card by eye against the rules that stage covers"
  }
};
function lintFragment(fragment, maxBytes) {
  const sizeBytes = new TextEncoder().encode(fragment).length;
  const sink = new FindingSink(fragment);
  if (fragment.trim().length === 0) {
    sink.add("VZ001", 0, 0);
    return { sizeBytes, findings: sink.sorted() };
  }
  if (sizeBytes > maxBytes) {
    sink.add("VZ002", 0, 0, `${sizeBytes} bytes, over the ${maxBytes}-byte limit`);
    return { sizeBytes, findings: sink.sorted() };
  }
  const skipped = [];
  const reasons = [];
  const guard = (stage, run) => {
    try {
      run();
    } catch (error) {
      const reason = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      skipped.push(`${stage}: ${reason}`);
      reasons.push(`${stage} (${reason})`);
    }
  };
  let doc;
  guard("scan", () => {
    doc = scanDocument(fragment);
  });
  if (doc !== void 0) {
    const scanned = doc;
    for (const [stage, check] of RULE_STAGES) guard(stage, () => check(scanned, sink));
  }
  if (reasons.length > 0) sink.add("VZ199", 0, 0, reasons.join("; "));
  return { sizeBytes, findings: sink.sorted(), ...skipped.length > 0 ? { skipped } : {} };
}
var RULE_STAGES = [
  ["skeleton", (doc, sink) => checkSkeleton(doc, sink)],
  ["escaped-markup", (doc, sink) => checkEscapedMarkup(doc, sink)],
  ["resources", (doc, sink) => checkResources(doc, sink)],
  ["forms", (doc, sink) => checkForms(doc, sink)],
  ["scripts", (doc, sink) => checkScripts(doc, sink)],
  ["styles", (doc, sink) => checkStyles(doc, sink)],
  ["ids", (doc, sink) => checkIds(doc, sink)]
];
function validateFragment(fragment, maxBytes) {
  const { sizeBytes, findings } = lintFragment(fragment, maxBytes);
  const errors = findings.filter((f) => f.severity === "error");
  if (errors.length > 0) throw new Error(formatRejection(errors, findings.filter((f) => f.severity === "warn")));
  return sizeBytes;
}
function imageSources(fragment) {
  const out = [];
  for (const tag of scanDocument(fragment).tags) {
    if (tag.closing || tag.name !== "img") continue;
    const a = tag.attrs.find((entry) => entry.name === "data-viz-src");
    if (a?.value !== void 0 && a.value.trim().length > 0) out.push({ raw: a.value, offset: a.valueStart });
  }
  return out;
}
var SHOWN_PER_CODE = 3;
function formatRejection(errors, warnings = [], patched = false) {
  const count = errors.length === 1 ? "the error" : `the ${errors.length} errors`;
  const where = patched ? "the card as your patch would leave it" : "the fragment you sent";
  const head = `invalid visualization: nothing was rendered. Fix ${count} below and call visualize again (positions are line:column in ${where}).`;
  const parts = [head, formatFindings(errors)];
  if (warnings.length > 0) parts.push("Warnings (not blocking; fix them in the same call if cheap):", formatFindings(warnings));
  return parts.join("\n");
}
function formatFindings(findings) {
  const placed = findings.map((f) => "finding" in f ? f : { finding: f, origin: "new" });
  const byCode = /* @__PURE__ */ new Map();
  for (const entry of placed) {
    const list = byCode.get(entry.finding.code) ?? [];
    list.push(entry);
    byCode.set(entry.finding.code, list);
  }
  const lines = [];
  for (const [code, list] of byCode) {
    for (const { finding, origin } of list.slice(0, SHOWN_PER_CODE)) {
      const tag = origin === "edit" ? " [in your new_str]" : origin === "preexisting" ? " [already in the card before this patch]" : "";
      lines.push(
        `${code} ${finding.severity} at ${finding.line}:${finding.column}${tag}: ${finding.message}`,
        `    | ${finding.excerpt}`
      );
    }
    const rest = list.slice(SHOWN_PER_CODE);
    if (rest.length > 0) {
      const at = rest.slice(0, 10).map(({ finding }) => `${finding.line}:${finding.column}`).join(", ");
      lines.push(`    (+${rest.length} more ${code} at ${at}${rest.length > 10 ? ", \u2026" : ""})`);
    }
    lines.push(`    fix: ${list[0].finding.fix}`);
  }
  return lines.join("\n");
}
var FindingSink = class {
  src;
  lineStarts = [0];
  items = [];
  /** Index into {@link items} per code and offset. */
  seen = /* @__PURE__ */ new Map();
  constructor(src) {
    this.src = src;
    for (let i = src.indexOf("\n"); i !== -1; i = src.indexOf("\n", i + 1)) this.lineStarts.push(i + 1);
  }
  /**
   * Record one finding; a second one of the same code at the same offset is
   * dropped unless it is more severe.
   * @param cap - `warn` downgrades an error rule for a match read with doubt.
   */
  add(code, offset, length, detail, cap) {
    const rule = LINT_RULES[code];
    const severity = cap ?? rule.severity;
    const key = `${code}:${offset}`;
    const at = this.seen.get(key);
    if (at !== void 0 && (this.items[at].severity === "error" || severity === "warn")) return;
    const { line, column, excerpt } = this.locate(offset);
    const finding = {
      code,
      severity,
      message: detail === void 0 ? rule.message : `${rule.message}: ${detail}`,
      fix: rule.fix,
      offset,
      length: Math.max(1, length),
      line,
      column,
      excerpt
    };
    if (at === void 0) {
      this.seen.set(key, this.items.length);
      this.items.push(finding);
    } else {
      this.items[at] = finding;
    }
  }
  sorted() {
    return [...this.items].sort((a, b) => a.offset - b.offset);
  }
  locate(offset) {
    let lo = 0;
    let hi = this.lineStarts.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (this.lineStarts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    const start = this.lineStarts[lo];
    const next = this.lineStarts[lo + 1];
    const end = next === void 0 ? this.src.length : next - 1;
    const column = offset - start;
    const from = Math.max(start, offset - 40);
    const to = Math.min(end, Math.max(offset + 60, from + 100));
    let excerpt = this.src.slice(from, to).replaceAll("	", " ").trim();
    if (from > start) excerpt = `\u2026${excerpt}`;
    if (to < end) excerpt = `${excerpt}\u2026`;
    return { line: lo + 1, column: column + 1, excerpt };
  }
};
var LITERAL_TAGS = /* @__PURE__ */ new Set(["pre", "code", "kbd", "samp", "textarea"]);
var VOID_OR_SELF = /\/\s*$/u;
var JS_TYPES = /* @__PURE__ */ new Set(["", "text/javascript", "application/javascript", "module", "text/ecmascript", "application/ecmascript"]);
function scanDocument(src) {
  const n = src.length;
  const tags = [];
  const blocks = [];
  const text = [];
  const markupBlanks = [];
  let literalDepth = 0;
  let i = 0;
  const pushText = (start, end) => {
    if (end > start) text.push({ start, end, literal: literalDepth > 0 });
  };
  while (i < n) {
    const lt = src.indexOf("<", i);
    if (lt === -1) {
      pushText(i, n);
      break;
    }
    pushText(i, lt);
    if (src.startsWith("<!--", lt)) {
      const close = src.indexOf("-->", lt + 4);
      const end = close === -1 ? n : close + 3;
      markupBlanks.push([lt, end]);
      i = end;
      continue;
    }
    const next = src[lt + 1] ?? "";
    if (next === "/") {
      const closing = /<\/([a-z][\w:-]*)[^>]*>?/iuy;
      closing.lastIndex = lt;
      const m = closing.exec(src);
      if (m) {
        const name2 = m[1].toLowerCase();
        tags.push({ name: name2, start: lt, end: lt + m[0].length, closing: true, attrs: [] });
        if (LITERAL_TAGS.has(name2) && literalDepth > 0) literalDepth -= 1;
        i = lt + m[0].length;
        continue;
      }
      i = lt + 1;
      continue;
    }
    if (next === "!" || next === "?") {
      const gt = src.indexOf(">", lt);
      const end = gt === -1 ? n : gt + 1;
      const name2 = /^<([!?][a-z]*)/iu.exec(src.slice(lt, Math.min(end, lt + 12)))?.[1]?.toLowerCase() ?? "!";
      tags.push({ name: name2, start: lt, end, closing: false, attrs: [] });
      i = end;
      continue;
    }
    if (!/[a-z]/iu.test(next)) {
      i = lt + 1;
      continue;
    }
    const tag = parseOpenTag(src, lt);
    tags.push(tag);
    i = tag.end;
    if (tag.name === "script" || tag.name === "style") {
      const closer = tag.name === "script" ? /<\/script\b[^>]*>?/giu : /<\/style\b[^>]*>?/giu;
      closer.lastIndex = tag.end;
      const m = closer.exec(src);
      const bodyEnd = m ? m.index : n;
      blocks.push({ kind: tag.name, tag, start: tag.end, end: bodyEnd });
      markupBlanks.push([tag.end, bodyEnd]);
      if (m) tags.push({ name: tag.name, start: m.index, end: m.index + m[0].length, closing: true, attrs: [] });
      i = m ? m.index + m[0].length : n;
      continue;
    }
    if (LITERAL_TAGS.has(tag.name) && !VOID_OR_SELF.test(src.slice(tag.start, tag.end - 1))) literalDepth += 1;
  }
  const jsSegments = [];
  const strings = /* @__PURE__ */ new Map();
  const literals = [];
  const decls = [];
  const imports = [];
  let importMap = false;
  const importMapUrls = [];
  for (const block of blocks) {
    if (block.kind === "script") {
      if (attr(block.tag, "src") !== void 0) continue;
      const type = (attr(block.tag, "type") ?? "").trim().toLowerCase();
      if (type === "importmap") {
        importMap = true;
        for (const s of scanJs(src, block.start, block.end).strings) {
          if (/^(?:https?:)?\/\//iu.test(s.value)) importMapUrls.push([s.start + 1, s.value]);
        }
        continue;
      }
      if (!JS_TYPES.has(type)) continue;
      const scan = scanJs(src, block.start, block.end);
      jsSegments.push([block.start, scan.code]);
      for (const s of scan.strings) strings.set(s.start, s);
      for (const run of scan.literals) literals.push(run);
    } else {
      const scan = scanCss(src, block.start, block.end);
      for (const decl of scan.decls) decls.push(decl);
      for (const entry of scan.imports) imports.push(entry);
    }
  }
  for (const tag of tags) {
    const style = tag.attrs.find((a) => a.name === "style");
    if (style?.value === void 0) continue;
    for (const decl of scanCss(src, style.valueStart, style.valueStart + style.value.length).decls) decls.push(decl);
  }
  return {
    src,
    tags,
    blocks,
    text,
    markup: blank(src, markupBlanks),
    js: overlay(n, jsSegments),
    jsRanges: jsSegments.map(([start, code]) => [start, start + code.length]),
    strings,
    literals,
    decls,
    imports,
    importMap,
    importMapUrls
  };
}
function parseOpenTag(src, lt) {
  const n = src.length;
  let i = lt + 1;
  while (i < n && /[\w:-]/u.test(src[i])) i++;
  const name2 = src.slice(lt + 1, i).toLowerCase();
  const attrs = [];
  while (i < n) {
    const c = src[i];
    if (c === ">") return { name: name2, start: lt, end: i + 1, closing: false, attrs };
    if (/\s|\//u.test(c)) {
      i++;
      continue;
    }
    const nameStart = i;
    while (i < n && !/[\s"'>/=]/u.test(src[i])) i++;
    if (i === nameStart) {
      i++;
      continue;
    }
    const attrName = src.slice(nameStart, i).toLowerCase();
    let j = i;
    while (j < n && /\s/u.test(src[j])) j++;
    if (src[j] !== "=") {
      attrs.push({ name: attrName, value: void 0, start: nameStart, valueStart: i, raw: "" });
      continue;
    }
    j++;
    while (j < n && /\s/u.test(src[j])) j++;
    const q = src[j];
    if (q === '"' || q === "'") {
      const close = src.indexOf(q, j + 1);
      const end = close === -1 ? n : close;
      attrs.push({ name: attrName, value: src.slice(j + 1, end), start: nameStart, valueStart: j + 1, raw: src.slice(j, end + 1) });
      i = Math.min(n, end + 1);
    } else {
      let end = j;
      while (end < n && !/[\s>]/u.test(src[end])) end++;
      attrs.push({ name: attrName, value: src.slice(j, end), start: nameStart, valueStart: j, raw: src.slice(j, end) });
      i = end;
    }
  }
  return { name: name2, start: lt, end: n, closing: false, attrs };
}
function attr(tag, name2) {
  return tag.attrs.find((a) => a.name === name2)?.value;
}
function blank(src, ranges, from = 0, to = src.length) {
  if (ranges.length === 0) return src.slice(from, to);
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  let out = "";
  let at = from;
  for (const [start, rawEnd] of sorted) {
    const end = Math.min(rawEnd, to);
    if (end <= at) continue;
    const cut = Math.max(start, at);
    out += src.slice(at, cut) + " ".repeat(end - cut);
    at = end;
  }
  return out + src.slice(at, to);
}
function indexWithin(src, needle, from, to) {
  if (from >= to) return -1;
  const at = src.slice(from, to).indexOf(needle);
  return at === -1 ? -1 : from + at;
}
function overlay(n, segments) {
  let out = "";
  let at = 0;
  for (const [start, text] of segments) {
    out += " ".repeat(start - at) + text;
    at = start + text.length;
  }
  return out + " ".repeat(Math.max(0, n - at));
}
var REGEX_AFTER_WORD = /* @__PURE__ */ new Set(["return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw", "yield", "await", "instanceof"]);
var REGEX_AFTER_PUNCT = /* @__PURE__ */ new Set([..."(,=:[!&|?{};+-*%<>~^"]);
function scanJs(src, from, to) {
  const blanks = [];
  const strings = [];
  const literals = [];
  const literal = (start, end) => {
    blanks.push([start, end]);
    if (end > start) literals.push([start, src.slice(start, end)]);
  };
  const frames = [];
  let depth = 0;
  let prev = "";
  const template = (open3, start, interpolated) => {
    let j = start;
    while (j < to) {
      const c = src[j];
      if (c === "\\") {
        j += 2;
        continue;
      }
      if (c === "`") break;
      if (c === "$" && src[j + 1] === "{") {
        literal(start, j);
        frames.push({ open: open3, depth });
        depth = 0;
        prev = "{";
        return j + 2;
      }
      j++;
    }
    j = Math.min(j, to);
    literal(start, j);
    strings.push({ start: open3, end: Math.min(j + 1, to), value: src.slice(open3 + 1, j), interpolated });
    prev = "`";
    return Math.min(j + 1, to);
  };
  let failed;
  const path = [];
  const scanRegex = (start) => {
    let j = start + 1;
    let inClass = false;
    path.length = 0;
    const fail = () => {
      failed ??= new Uint8Array(2 * (to - from) + 2);
      for (const state of path) failed[state] = 1;
      return -1;
    };
    while (j < to) {
      const state = 2 * (j - from) + (inClass ? 1 : 0);
      if (failed?.[state] === 1) return fail();
      path.push(state);
      const c = src[j];
      if (c === "\n") return fail();
      if (c === "\\") {
        j += 2;
        continue;
      }
      if (c === "[") inClass = true;
      else if (c === "]") inClass = false;
      else if (c === "/" && !inClass) {
        j++;
        while (j < to && /[a-z]/u.test(src[j])) j++;
        return j;
      }
      j++;
    }
    return fail();
  };
  let i = from;
  while (i < to) {
    const c = src[i];
    if (c === "/" && src[i + 1] === "/") {
      const nl = indexWithin(src, "\n", i, to);
      const end = nl === -1 ? to : nl;
      blanks.push([i, end]);
      i = end;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const close = indexWithin(src, "*/", i + 2, to);
      const end = close === -1 ? to : close + 2;
      blanks.push([i, end]);
      i = end;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < to && src[j] !== c && src[j] !== "\n") j += src[j] === "\\" ? 2 : 1;
      j = Math.min(j, to);
      strings.push({ start: i, end: Math.min(j + 1, to), value: src.slice(i + 1, j), interpolated: false });
      literal(i + 1, j);
      i = Math.min(j + 1, to);
      prev = '"';
      continue;
    }
    if (c === "`") {
      i = template(i, i + 1, false);
      continue;
    }
    if (c === "/" && (prev === "" || REGEX_AFTER_PUNCT.has(prev) || REGEX_AFTER_WORD.has(prev))) {
      const end = scanRegex(i);
      if (end !== -1) {
        blanks.push([i + 1, end]);
        i = end;
        prev = "/re";
        continue;
      }
    }
    if (/[A-Za-z_$]/u.test(c)) {
      let j = i + 1;
      while (j < to && /[\w$]/u.test(src[j])) j++;
      prev = src.slice(i, j);
      i = j;
      continue;
    }
    if (c === "{") depth += 1;
    if (c === "}") {
      const frame = frames.at(-1);
      if (frame !== void 0 && depth === 0) {
        frames.pop();
        depth = frame.depth;
        i = template(frame.open, i + 1, true);
        continue;
      }
      depth -= 1;
    }
    if (!/\s/u.test(c)) prev = c;
    i++;
  }
  for (let frame = frames.pop(); frame !== void 0; frame = frames.pop()) {
    strings.push({ start: frame.open, end: to, value: src.slice(frame.open + 1, to), interpolated: true });
  }
  return { code: blank(src, blanks, from, to), strings, literals };
}
function scanCss(src, from, to) {
  const commentBlanks = [];
  for (let i = from; i < to; i++) {
    const c = src[i];
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < to && src[j] !== c && src[j] !== "\n") j += src[j] === "\\" ? 2 : 1;
      i = j;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const close = indexWithin(src, "*/", i + 2, to);
      const end = close === -1 ? to : close + 2;
      commentBlanks.push([i, end]);
      i = end - 1;
    }
  }
  const css = blank(src.slice(from, to), commentBlanks.map(([a, b]) => [a - from, b - from]));
  const decls = [];
  const imports = [];
  let segStart = 0;
  let parens = 0;
  const flush = (end, terminator) => {
    const segment = css.slice(segStart, end);
    if (terminator === "{") return;
    const lead = segment.length - segment.trimStart().length;
    const body = segment.trim();
    if (body.length === 0) return;
    const at = from + segStart + lead;
    if (body.startsWith("@")) {
      const m = /^@import\s+(?:url\(\s*)?["']?([^"')\s;]+)/iu.exec(body);
      if (m) imports.push([at + body.indexOf(m[1]), m[1]]);
      return;
    }
    const colon = body.indexOf(":");
    if (colon <= 0) return;
    const prop = body.slice(0, colon).trim();
    if (!/^-{0,2}[a-z][\w-]*$/iu.test(prop)) return;
    const rawValue = body.slice(colon + 1);
    const valueLead = rawValue.length - rawValue.trimStart().length;
    decls.push({ prop: prop.toLowerCase(), propStart: at, value: rawValue.trim(), valueStart: at + colon + 1 + valueLead });
  };
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== c && css[j] !== "\n") j += css[j] === "\\" ? 2 : 1;
      i = j;
      continue;
    }
    if (c === "(") parens += 1;
    else if (c === ")") parens = Math.max(0, parens - 1);
    else if (parens === 0 && (c === "{" || c === "}" || c === ";")) {
      flush(i, c);
      segStart = i + 1;
    }
  }
  flush(css.length, "");
  return { decls, imports };
}
function checkSkeleton(doc, sink) {
  for (const m of doc.markup.matchAll(/<!doctype\b|<\s*(?:\/\s*)?(?:html|head|body)\b/giu)) {
    sink.add("VZ003", m.index, m[0].length, JSON.stringify(m[0]));
  }
}
var ESCAPE_SEQ = /\\[nrt]/gu;
function checkEscapedMarkup(doc, sink) {
  const { src } = doc;
  for (const tag of doc.tags) {
    for (const a of tag.attrs) {
      if (a.raw.startsWith('\\"') || a.raw.startsWith("\\'")) {
        sink.add("VZ004", a.valueStart, 2, `attribute quoted as ${JSON.stringify(src.slice(a.start, a.valueStart + 2))}`);
      }
    }
  }
  const hits = [];
  for (const run of doc.text) {
    if (run.literal) continue;
    const body = src.slice(run.start, run.end);
    const head = /^(?:\\[nrt]|\s)*/u.exec(body)[0];
    let tailStart = body.length;
    while (tailStart > head.length) {
      const c = body[tailStart - 1];
      if (/\s/u.test(c)) tailStart -= 1;
      else if ("nrt".includes(c) && body[tailStart - 2] === "\\") tailStart -= 2;
      else break;
    }
    const tail = body.slice(Math.max(tailStart, head.length));
    for (const m of head.matchAll(ESCAPE_SEQ)) hits.push(run.start + m.index);
    for (const m of tail.matchAll(ESCAPE_SEQ)) hits.push(run.start + body.length - tail.length + m.index);
  }
  if (hits.length >= 2) sink.add("VZ004", hits[0], 2, "literal \\n between tags");
  for (const block of doc.blocks) {
    if (block.kind !== "script") continue;
    const body = src.slice(block.start, block.end);
    const lead = body.length - body.replace(/^[ \t]+/u, "").length;
    if (/^\\[nr]/u.test(body.slice(lead))) sink.add("VZ004", block.start + lead, 2, "script body starts with a literal \\n");
  }
}
function checkForms(doc, sink) {
  for (const tag of doc.tags) {
    if (tag.closing) continue;
    if (tag.name === "form") {
      const action = tag.attrs.find((a) => a.name === "action");
      const method = tag.attrs.find((a) => a.name === "method" && /post/iu.test(a.value ?? ""));
      const hit = action ?? method;
      if (hit) sink.add("VZ008", hit.start, hit.name.length, `<form ${hit.name}=\u2026>`);
    }
    const formAction = tag.attrs.find((a) => a.name === "formaction");
    if (formAction) sink.add("VZ008", formAction.start, formAction.name.length, `formaction on <${tag.name}>`);
  }
}
var RESOURCE_ATTRS = /* @__PURE__ */ new Map([
  ["script", ["src"]],
  ["link", ["href"]],
  ["img", ["src"]],
  ["video", ["src", "poster"]],
  ["audio", ["src"]],
  ["source", ["src"]],
  ["track", ["src"]],
  ["input", ["src"]],
  ["embed", ["src"]],
  ["object", ["data"]],
  ["image", ["href", "xlink:href"]],
  ["feimage", ["href", "xlink:href"]]
]);
function checkResources(doc, sink) {
  for (const tag of doc.tags) {
    if (tag.closing) continue;
    const names = RESOURCE_ATTRS.get(tag.name);
    if (names === void 0) continue;
    if (tag.name === "link" && /\b(?:preconnect|dns-prefetch)\b/iu.test(attr(tag, "rel") ?? "")) continue;
    const image = tag.name === "img";
    for (const a of tag.attrs) {
      if (a.value !== void 0 && names.includes(a.name)) reportUrl(sink, a.value, a.valueStart, "markup", false, void 0, image);
    }
  }
  for (const decl of doc.decls) {
    for (const m of decl.value.matchAll(/(?<![\w-])url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))/giu)) {
      const url = m[1] ?? m[2] ?? m[3] ?? "";
      reportUrl(sink, url, decl.valueStart + m.index + m[0].indexOf(url, 4), "markup", false);
    }
  }
  for (const [offset, url] of [...doc.imports, ...doc.importMapUrls]) reportUrl(sink, url, offset, "markup", false);
  const { js } = doc;
  const specifierAt = (pos) => stringAt(doc, pos);
  for (const m of js.matchAll(/(?<![\w$.])(?:import\s*\(|from(?=\s*["'`])|import(?=\s*["'`]))/gu)) {
    const s = specifierAt(m.index + m[0].length);
    if (s && !s.interpolated) reportUrl(sink, s.value, s.start + 1, "module", doc.importMap);
  }
  for (const m of js.matchAll(/\.src\s*=(?!=)/gu)) {
    const s = specifierAt(m.index + m[0].length);
    if (s && !s.interpolated && /^(?:https?:)?\/\//iu.test(s.value)) reportUrl(sink, s.value, s.start + 1, "markup", false, "warn");
  }
}
function reportUrl(sink, raw, offset, context, importMap, cap, image = false) {
  const url = raw.trim();
  if (url.length === 0 || url.startsWith("#") || url.includes("${")) return;
  const lead = raw.length - raw.trimStart().length;
  const at = offset + lead;
  if (/^(?:data|blob|about|javascript|mailto|tel):/iu.test(url)) return;
  const scheme = /^([a-z][\w+.-]*):/iu.exec(url)?.[1]?.toLowerCase();
  if (scheme === void 0 && !url.startsWith("//")) {
    if (context === "module" && importMap) return;
    sink.add(image ? "VZ107" : "VZ106", at, url.length, JSON.stringify(url));
    return;
  }
  let parsed;
  try {
    parsed = new URL(url.startsWith("//") ? `https:${url}` : url);
  } catch {
    return;
  }
  const host = parsed.host.toLowerCase();
  if (!ALLOWED_HOSTS.includes(host)) {
    const embeddable = image && (scheme === void 0 || scheme === "http" || scheme === "https");
    sink.add(embeddable ? "VZ011" : "VZ005", at, url.length, `${host || url} is not on the allowlist`, cap);
    return;
  }
  if (scheme !== void 0 && scheme !== "https") {
    sink.add("VZ005", at, url.length, `${scheme}: URL; the card loads ${host} over https only`, cap);
    return;
  }
  const version = cdnVersion(host, parsed.pathname);
  if (version.kind === "none") sink.add("VZ006", at, url.length, `${version.what} has no version in ${JSON.stringify(url)}`, cap);
  else if (version.kind === "tag") sink.add("VZ006", at, url.length, `${version.what}@${version.version} is a moving tag`, cap);
  else if (version.kind === "loose") sink.add("VZ105", at, url.length, `${version.what}@${version.version}`);
}
function cdnVersion(host, pathname) {
  const segs = pathname.split("/").filter((s) => s.length > 0).map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
  const na = { kind: "n/a", what: "", version: "" };
  const pkg = (at) => {
    const first = segs[at];
    if (first === void 0) return na;
    const scoped = first.startsWith("@");
    const nameSeg = scoped ? segs[at + 1] : first;
    if (nameSeg === void 0) return na;
    const idx = nameSeg.indexOf("@");
    const name2 = idx === -1 ? nameSeg : nameSeg.slice(0, idx);
    const what = scoped ? `${first}/${name2}` : name2;
    return classifyVersion(what, idx === -1 ? void 0 : nameSeg.slice(idx + 1));
  };
  if (host === "cdn.jsdelivr.net") {
    if (segs[0] === "npm") return pkg(1);
    if (segs[0] === "gh" && segs[2] !== void 0) {
      const idx = segs[2].indexOf("@");
      return classifyVersion(`${segs[1]}/${idx === -1 ? segs[2] : segs[2].slice(0, idx)}`, idx === -1 ? void 0 : segs[2].slice(idx + 1));
    }
    return na;
  }
  if (host === "unpkg.com") return pkg(0);
  if (host === "esm.sh") {
    let at = 0;
    if (/^(?:v\d+|stable)$/u.test(segs[0] ?? "")) at = 1;
    const head = segs[at];
    if (head === void 0 || ["gh", "jsr", "pr", "run", "tsx", "x"].includes(head)) return na;
    if (head.startsWith("*")) segs[at] = head.slice(1);
    return pkg(at);
  }
  if (host === "cdnjs.cloudflare.com") {
    if (segs[0] !== "ajax" || segs[1] !== "libs" || segs[2] === void 0) return na;
    const version = segs[3];
    if (version === void 0 || segs.length < 5 || !/^\d/u.test(version)) return { kind: "none", what: segs[2], version: "" };
    return classifyVersion(segs[2], version);
  }
  return na;
}
var EXACT_VERSION = /^v?\d+\.\d+\.\d+(?:[-+][\w.+-]*)?$/u;
function classifyVersion(what, version) {
  if (version === void 0 || version.length === 0) return { kind: "none", what, version: "" };
  if (EXACT_VERSION.test(version)) return { kind: "pinned", what, version };
  if (/^[\^~>=<]*v?\d/u.test(version)) return { kind: "loose", what, version };
  return { kind: "tag", what, version };
}
function stringAt(doc, pos) {
  let i = pos;
  while (i < doc.src.length && /\s/u.test(doc.src[i])) i++;
  return doc.strings.get(i);
}
function nextChar(src, pos) {
  let i = pos;
  while (i < src.length && /\s/u.test(src[i])) i++;
  return src[i] ?? "";
}
function checkScripts(doc, sink) {
  const { js, src } = doc;
  checkGlobalApis(doc, sink);
  for (const m of js.matchAll(/\.\s*style\s*\.\s*colorScheme\s*=(?!=)/gu)) sink.add("VZ009", m.index, m[0].length, "style.colorScheme");
  for (const m of js.matchAll(/(?<![\w$])(?:localStorage|sessionStorage|indexedDB)(?![\w$])|\bdocument\s*\.\s*cookie(?![\w$])/gu)) {
    sink.add("VZ108", m.index, m[0].length, m[0].replaceAll(/\s+/gu, ""));
  }
  for (const m of js.matchAll(/\bChart\s*\.\s*defaults\s*\.\s*font\s*\.\s*family\s*=(?!=)/gu)) {
    const s = stringAt(doc, m.index + m[0].length);
    if (s && !s.interpolated && s.value.length <= 32 && s.value.trim().toLowerCase() === "inherit") sink.add("VZ104", m.index, s.end - m.index);
  }
  for (const m of js.matchAll(/\.\s*style\s*\.\s*([a-zA-Z]+)\s*=(?!=)/gu)) {
    const s = stringAt(doc, m.index + m[0].length);
    if (s && !s.interpolated) checkColorValue(sink, kebab(m[1]), s.value, s.start + 1);
  }
  for (const m of js.matchAll(/\.\s*(setProperty|setAttribute|attr|style)\s*\(/gu)) {
    const name2 = stringAt(doc, m.index + m[0].length);
    if (!name2 || name2.interpolated || nextChar(src, name2.end) !== ",") continue;
    const value = stringAt(doc, src.indexOf(",", name2.end) + 1);
    if (!value || value.interpolated) continue;
    const prop = name2.value.trim().toLowerCase();
    const attribute = m[1] === "setAttribute" || m[1] === "attr";
    if (prop === "color-scheme") sink.add("VZ009", name2.start, name2.end - name2.start, `${JSON.stringify(name2.value)} set from script`, attribute ? "warn" : void 0);
    else if (prop === "style") checkInlineCss(sink, src, value.start + 1, value.value.length);
    else checkColorValue(sink, prop, value.value, value.start + 1);
  }
  for (const m of js.matchAll(/\b(\w*(?:Background|Border)Color|backgroundColor|borderColor|fillStyle|strokeStyle|shadowColor)\s*[:=](?!=)/gu)) {
    const s = stringAt(doc, m.index + m[0].length);
    if (s && !s.interpolated) checkColorValue(sink, "color", s.value, s.start + 1, m[1]);
  }
  for (const [at, text] of doc.literals) {
    for (const m of text.matchAll(/(?<![\w-])(fill|stroke|stop-color|flood-color|lighting-color|color|bgcolor)\s*=\s*\\?["']([^"'\\]+)/giu)) {
      checkColorValue(sink, m[1].toLowerCase(), m[2], at + m.index + m[0].length - m[2].length);
    }
    for (const m of text.matchAll(/(?<![\w-])style\s*=\s*\\?["']([^"'\\]+)/giu)) {
      checkInlineCss(sink, src, at + m.index + m[0].length - m[1].length, m[1].length, "warn");
    }
  }
}
var GLOBAL_RECEIVERS = /* @__PURE__ */ new Set(["window", "self", "globalThis"]);
var NETWORK_CONSTRUCTORS = /(?<![\w$])(?:XMLHttpRequest|WebSocket|EventSource)(?![\w$])/gu;
var WATCHED_NAMES = /(?<![\w$])(?:fetch|XMLHttpRequest|WebSocket|EventSource|navigator|sendBeacon|document|currentScript|window|self|globalThis)(?![\w$])/gu;
var VALUE_KEYWORDS = /* @__PURE__ */ new Set(["new", "typeof", "instanceof", "await", "void", "return", "delete", "throw", "in", "of", "case", "yield"]);
var VALUE_OPERATORS = /* @__PURE__ */ new Set([..."=!+-*/%&|^~<>?:"]);
var MAX_CHAIN_LINKS = 16;
function isSpace(c) {
  if (c === void 0) return false;
  const code = c.charCodeAt(0);
  if (code < 128) return code === 32 || code >= 9 && code <= 13;
  return /\s/u.test(c);
}
function isWordChar(c) {
  if (c === void 0) return false;
  const code = c.charCodeAt(0);
  return code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 48 && code <= 57 || code === 95 || code === 36;
}
function skipBack(js, i) {
  let at = i;
  while (at >= 0 && isSpace(js[at])) at--;
  return at;
}
function skipForward(js, i) {
  let at = i;
  while (at < js.length && isSpace(js[at])) at++;
  return at;
}
function wordBefore(js, index) {
  let i = skipBack(js, index - 1);
  const end = i + 1;
  while (i >= 0 && isWordChar(js[i])) i--;
  return [js.slice(i + 1, end), i + 1];
}
function receiverOf(js, index) {
  let i = skipBack(js, index - 1);
  if (js[i] !== "." || js[i - 1] === ".") return void 0;
  i -= js[i - 1] === "?" ? 2 : 1;
  const [name2, at] = wordBefore(js, i + 1);
  return { name: name2, index: at };
}
function reach(js, index) {
  const r = receiverOf(js, index);
  if (r === void 0) return { kind: "direct", start: index, via: "" };
  if (!GLOBAL_RECEIVERS.has(r.name)) return { kind: "member", start: r.index, via: r.name };
  return { kind: receiverOf(js, r.index) === void 0 ? "global" : "chain", start: r.index, via: r.name };
}
function chainStart(js, index) {
  let at = index;
  for (let links = 0; links < MAX_CHAIN_LINKS; links++) {
    const r = receiverOf(js, at);
    if (r === void 0) return at;
    if (r.name === "") return void 0;
    at = r.index;
  }
  return void 0;
}
function boundNames(js) {
  const bound = /* @__PURE__ */ new Set();
  const assigned = /* @__PURE__ */ new Set();
  for (const m of js.matchAll(WATCHED_NAMES)) {
    const name2 = m[0];
    const next = skipForward(js, m.index + name2.length);
    const c = js[next];
    const assignment = c === "=" && js[next + 1] !== "=" && js[next + 1] !== ">";
    const r = receiverOf(js, m.index);
    if (r !== void 0) {
      if (assignment && (GLOBAL_RECEIVERS.has(r.name) || r.name === "navigator" || r.name === "document")) assigned.add(name2);
      continue;
    }
    if (assignment || c === "=" && js[next + 1] === ">") {
      bound.add(name2);
      continue;
    }
    if (c === "(") {
      let i = skipBack(js, m.index - 1);
      if (js[i] === "*") i = skipBack(js, i - 1);
      if (wordBefore(js, i + 1)[0] === "function") bound.add(name2);
      continue;
    }
    if (c === "." || c === "`" || c === "?" && js[next + 1] === ".") continue;
    const [word] = wordBefore(js, m.index);
    if (word !== "" && VALUE_KEYWORDS.has(word)) continue;
    if (word === "" && VALUE_OPERATORS.has(js[skipBack(js, m.index - 1)] ?? "")) continue;
    bound.add(name2);
  }
  return { bound, assigned };
}
function parenPairs(doc) {
  const close = new Int32Array(doc.js.length).fill(-1);
  const stack = [];
  for (const [from, to] of doc.jsRanges) {
    stack.length = 0;
    for (let i = from; i < to; i++) {
      const c = doc.js.charCodeAt(i);
      if (c === 40) stack.push(i);
      else if (c === 41) {
        const open3 = stack.pop();
        if (open3 !== void 0) close[open3] = i;
      }
    }
  }
  return close;
}
function checkGlobalApis(doc, sink) {
  const { js, src } = doc;
  if (!/fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|currentScript/u.test(js)) return;
  const { bound, assigned } = boundNames(js);
  const blobUrls = /\bcreateObjectURL\b/u.test(js);
  let pairs;
  const doubt = (how, name2, parent) => {
    if (how.kind === "member" || how.kind === "chain") return "reached through a property chain, which may be a local object";
    if (how.kind === "global" && bound.has(how.via)) return `the fragment binds its own ${how.via}`;
    const own = parent ?? name2;
    if (how.kind === "direct" && bound.has(own)) return `the fragment binds its own ${own}, which this may reach instead`;
    if (assigned.has(name2) || parent !== void 0 && assigned.has(parent)) return `the fragment replaces ${parent ?? name2} on a global object`;
    return void 0;
  };
  const report = (code, start, end, what, why) => {
    const detail = why === void 0 ? what : `${what === void 0 ? "" : `${what}; `}not certain: ${why}`;
    sink.add(code, start, end - start, detail, why === void 0 ? void 0 : "warn");
  };
  for (const m of js.matchAll(/(?<![\w$])fetch(?![\w$])/gu)) {
    const open3 = skipForward(js, m.index + 5);
    if (js[open3] !== "(") continue;
    const how = reach(js, m.index);
    if (how.kind === "member") continue;
    if (how.kind === "direct" && wordBefore(js, m.index)[0] === "function") continue;
    pairs ??= parenPairs(doc);
    const close = pairs[open3];
    let why = doubt(how, "fetch");
    if (close === -1) why ??= "the call is never closed, so it reads neither way";
    else {
      const after = skipForward(js, close + 1);
      if (js[after] === "{") {
        if (!/[\n\r\u2028\u2029]/u.test(src.slice(close + 1, after))) continue;
        why ??= "a block follows on the next line, so this may be a method definition";
      }
    }
    const arg = stringAt(doc, open3 + 1);
    if (arg && /^(?:data|blob):/iu.test(arg.value)) continue;
    if (!arg && blobUrls) continue;
    report("VZ007", how.start, open3 + 1, "fetch()", why);
  }
  for (const m of js.matchAll(NETWORK_CONSTRUCTORS)) {
    const how = reach(js, m.index);
    if (how.kind === "member") continue;
    const start = how.kind === "chain" ? chainStart(js, how.start) : how.start;
    if (start === void 0) continue;
    const [word, at] = wordBefore(js, start);
    if (word !== "new") continue;
    report("VZ007", at, m.index + m[0].length, m[0], doubt(how, m[0]));
  }
  for (const m of js.matchAll(/(?<![\w$])sendBeacon(?![\w$])/gu)) {
    const r = receiverOf(js, m.index);
    if (r?.name !== "navigator") continue;
    const open3 = skipForward(js, m.index + 10);
    if (js[open3] !== "(") continue;
    const how = reach(js, r.index);
    report("VZ007", how.start, open3 + 1, "navigator.sendBeacon()", doubt(how, "sendBeacon", "navigator"));
  }
  for (const m of js.matchAll(/(?<![\w$])currentScript(?![\w$])/gu)) {
    const r = receiverOf(js, m.index);
    if (r?.name !== "document") continue;
    const how = reach(js, r.index);
    report("VZ010", how.start, m.index + m[0].length, void 0, doubt(how, "currentScript", "document"));
  }
}
function kebab(name2) {
  return name2.replaceAll(/[A-Z]/gu, (c) => `-${c.toLowerCase()}`);
}
function checkInlineCss(sink, src, start, length, cap) {
  for (const decl of scanCss(src, start, start + length).decls) {
    if (decl.prop === "color-scheme") sink.add("VZ009", decl.propStart, decl.prop.length, `color-scheme: ${decl.value}`, cap);
    else checkColorValue(sink, decl.prop, decl.value, decl.valueStart);
  }
}
function checkStyles(doc, sink) {
  for (const decl of doc.decls) {
    if (decl.prop === "color-scheme") sink.add("VZ009", decl.propStart, decl.prop.length, `color-scheme: ${decl.value}`);
    else checkColorValue(sink, decl.prop, decl.value, decl.valueStart);
  }
  for (const tag of doc.tags) {
    if (tag.closing) continue;
    if (tag.name === "meta" && (attr(tag, "name") ?? "").trim().toLowerCase() === "color-scheme") {
      sink.add("VZ009", tag.start, tag.end - tag.start, '<meta name="color-scheme">');
    }
    if (tag.name === "stop" && Number(attr(tag, "stop-opacity") ?? "1") === 0) continue;
    for (const a of tag.attrs) {
      if (a.value !== void 0 && PRESENTATION_COLOR_ATTRS.has(a.name)) checkColorValue(sink, a.name, a.value, a.valueStart);
    }
  }
}
var PRESENTATION_COLOR_ATTRS = /* @__PURE__ */ new Set(["fill", "stroke", "stop-color", "flood-color", "lighting-color", "color", "bgcolor"]);
var COLOR_PROPS = /^(?:-webkit-)?(?:color|background(?:-color|-image)?|border(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?(?:-color)?|outline(?:-color)?|fill|stroke|stop-color|flood-color|lighting-color|caret-color|accent-color|text-decoration(?:-color)?|column-rule(?:-color)?|scrollbar-color|text-fill-color|text-stroke(?:-color)?|text-emphasis(?:-color)?|bgcolor)$/u;
var SKIP_PROPS = /^(?:box-shadow|text-shadow|filter|backdrop-filter|-webkit-box-shadow|content|font-family|font)$/u;
var COLOR_FNS = /* @__PURE__ */ new Set(["rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "oklab", "oklch", "color"]);
var SUPPRESSING_FNS = /* @__PURE__ */ new Set(["var", "light-dark", "url", "env", "attr"]);
var NAMED_COLORS = new Set("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen".split(" "));
function checkColorValue(sink, prop, value, valueStart, label = prop) {
  if (SKIP_PROPS.test(prop)) return;
  const named = COLOR_PROPS.test(prop) || PRESENTATION_COLOR_ATTRS.has(prop);
  const stack = [];
  let suppressing = 0;
  const suppressed = () => suppressing > 0;
  const open3 = (fn) => {
    stack.push(fn);
    if (SUPPRESSING_FNS.has(fn)) suppressing += 1;
  };
  for (let i = 0; i < value.length; ) {
    const c = value[i];
    if (c === '"' || c === "'") {
      const close = value.indexOf(c, i + 1);
      i = close === -1 ? value.length : close + 1;
      continue;
    }
    if (c === ")") {
      const fn = stack.pop();
      if (fn !== void 0 && SUPPRESSING_FNS.has(fn)) suppressing -= 1;
      i++;
      continue;
    }
    if (c === "(") {
      open3("");
      i++;
      continue;
    }
    if (c === "#") {
      const m = /^#([0-9a-f]+)(?![\w-])/iu.exec(value.slice(i, i + 10));
      const hex = m?.[1];
      if (hex && [3, 4, 6, 8].includes(hex.length)) {
        if (!suppressed() && !transparentHex(hex)) sink.add("VZ101", valueStart + i, hex.length + 1, `${label}: #${hex}`);
        i += hex.length + 1;
        continue;
      }
      i++;
      continue;
    }
    if (/[a-z_-]/iu.test(c) && (i === 0 || !/[\w-]/u.test(value[i - 1]))) {
      let j = i + 1;
      while (j < value.length && /[\w-]/u.test(value[j])) j++;
      const word = value.slice(i, j).toLowerCase();
      if (value[j] === "(") {
        if (COLOR_FNS.has(word)) {
          const close = matchParen(value, j);
          const args = value.slice(j + 1, close);
          if (!suppressed() && !/\b(?:var|light-dark)\(|\bfrom\b/iu.test(args) && !zeroAlpha(args)) {
            sink.add("VZ101", valueStart + i, close + 1 - i, `${label}: ${value.slice(i, close + 1)}`);
          }
          i = close + 1;
          continue;
        }
        open3(word);
        i = j + 1;
        continue;
      }
      if (named && !suppressed() && NAMED_COLORS.has(word)) sink.add("VZ101", valueStart + i, word.length, `${label}: ${word}`);
      i = j;
      continue;
    }
    i++;
  }
}
function matchParen(value, open3) {
  let depth = 0;
  for (let i = open3; i < value.length; i++) {
    if (value[i] === "(") depth += 1;
    else if (value[i] === ")") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return value.length - 1;
}
function transparentHex(hex) {
  return hex.length === 4 && hex[3] === "0" || hex.length === 8 && hex.slice(6) === "00";
}
function zeroAlpha(args) {
  const slash = args.split("/");
  const alpha = slash.length > 1 ? slash[1] : args.split(",")[3];
  if (alpha === void 0) return false;
  const n = Number.parseFloat(alpha);
  return n === 0;
}
function checkIds(doc, sink) {
  const { src, js } = doc;
  const markupIds = /* @__PURE__ */ new Set();
  for (const tag of doc.tags) {
    if (tag.closing) continue;
    const id = attr(tag, "id");
    if (id !== void 0 && id.trim().length > 0) markupIds.add(id.trim());
  }
  const known = new Set(markupIds);
  for (const m of src.matchAll(/(?<![\w-])id\s*=\s*\\?["'`]([^"'`\\\s]+)/gu)) known.add(m[1]);
  for (const m of src.matchAll(/["']id["']\s*,\s*["']([^"']+)["']/gu)) known.add(m[1]);
  const inlineJs = doc.blocks.find((b) => b.kind === "script" && js.slice(b.start, b.end).trim().length > 0);
  if (inlineJs && known.size === 0) sink.add("VZ103", inlineJs.tag.start, inlineJs.tag.end - inlineJs.tag.start);
  const builtIds = doc.literals.some(([, text]) => /(?<![\w-])id\s*=\s*\\?["']?[\w:.-]*(?:$|\$\{)/u.test(text)) || [...js.matchAll(/\.\s*id\s*=(?!=)/gu)].some((m) => !doc.strings.has(skipSpace(src, m.index + m[0].length))) || /\.(?:setAttribute|attr)\(\s*["']id["']\s*,(?!\s*["'])/u.test(src);
  if (builtIds) return;
  const lookups = [];
  for (const m of js.matchAll(/\bgetElementById\s*\(/gu)) {
    const s = stringAt(doc, m.index + m[0].length);
    if (!s || s.interpolated || nextChar(src, s.end) !== ")" || /\\/u.test(s.value)) continue;
    lookups.push({ id: s.value.trim(), s });
  }
  for (const m of js.matchAll(/\bquerySelector(?:All)?\s*\(/gu)) {
    const s = stringAt(doc, m.index + m[0].length);
    if (!s || s.interpolated || nextChar(src, s.end) !== ")" || /[\\,]/u.test(s.value)) continue;
    const id = /^\s*#([A-Za-z_][\w-]*)(?=$|[\s.:[>+~])/u.exec(s.value)?.[1];
    if (id !== void 0) lookups.push({ id, s });
  }
  for (const m of js.matchAll(/\bdshViz\s*\.\s*(?:bind|chart)\s*\(/gu)) {
    const s = stringAt(doc, m.index + m[0].length);
    if (!s || s.interpolated || nextChar(src, s.end) !== "," || /\\/u.test(s.value)) continue;
    const id = /^\s*#([A-Za-z_][\w-]*)\s*$/u.exec(s.value)?.[1];
    if (id !== void 0) lookups.push({ id, s });
  }
  const lookupCount = /* @__PURE__ */ new Map();
  for (const { id } of lookups) lookupCount.set(id, (lookupCount.get(id) ?? 0) + 1);
  const occurrences = wordCounter(src);
  for (const { id, s } of lookups) {
    if (id.length === 0 || known.has(id)) continue;
    if (occurrences(id) > (lookupCount.get(id) ?? 0)) continue;
    sink.add("VZ102", s.start, s.end - s.start, `#${id}`);
  }
}
var MAX_FREE_FORM_ID_SEARCHES = 16;
function wordCounter(src) {
  let runs;
  const searched = /* @__PURE__ */ new Map();
  return (word) => {
    if (/^[\w-]+$/u.test(word)) {
      if (runs === void 0) {
        runs = /* @__PURE__ */ new Map();
        for (const m of src.matchAll(/[\w-]+/gu)) runs.set(m[0], (runs.get(m[0]) ?? 0) + 1);
      }
      return runs.get(word) ?? 0;
    }
    let count = searched.get(word);
    if (count === void 0) {
      count = searched.size < MAX_FREE_FORM_ID_SEARCHES ? countWord(src, word) : Number.POSITIVE_INFINITY;
      searched.set(word, count);
    }
    return count;
  };
}
function skipSpace(src, pos) {
  let i = pos;
  while (i < src.length && /\s/u.test(src[i])) i++;
  return i;
}
function countWord(src, word) {
  let count = 0;
  for (let at = src.indexOf(word); at !== -1; at = src.indexOf(word, at + word.length)) {
    const before = src[at - 1] ?? "";
    const after = src[at + word.length] ?? "";
    if (!/[\w-]/u.test(before) && !/[\w-]/u.test(after)) count += 1;
  }
  return count;
}

// src/images.ts
var DEFAULT_IMAGE_LIMITS = {
  maxImageBytes: 5 * 1024 * 1024,
  maxCardBytes: 12 * 1024 * 1024,
  maxImages: 16,
  timeoutMs: 1e4,
  maxRedirects: 3
};
var ImageError = class extends Error {
};
async function resolveCardImages(fragment, options) {
  const limits = options.limits ?? DEFAULT_IMAGE_LIMITS;
  const all = imageSources(fragment).map((source) => source.raw);
  const sources = [...new Set(all)];
  const uses = /* @__PURE__ */ new Map();
  for (const src of all) uses.set(src, (uses.get(src) ?? 0) + 1);
  const failures = [];
  if (sources.length === 0) return { images: [], failures };
  const { store } = options;
  const unavailable = options.unavailable ?? (store === void 0 ? "this session has no card store to keep images in" : void 0);
  if (unavailable !== void 0 || store === void 0) {
    return { images: [], failures: sources.map((src) => ({ src, reason: unavailable })) };
  }
  const carried = new Map((options.previous ?? []).filter((image) => image.origin === "url").map((image) => [image.src, image]));
  const wanted = sources.slice(0, limits.maxImages);
  for (const src of sources.slice(limits.maxImages)) {
    failures.push({ src, reason: `the card already embeds ${limits.maxImages} images, the most one card takes` });
  }
  const fetched = await Promise.all(wanted.map(async (src) => {
    const kept = carried.get(src);
    if (kept !== void 0 && await store.exists(kept.id)) return { src, kept };
    try {
      return { src, image: await resolveOne(src, options, limits) };
    } catch (error) {
      if (options.signal.aborted) throw error;
      return { src, reason: reasonOf(error) };
    }
  }));
  let budget = limits.maxCardBytes;
  const images = [];
  for (const entry of fetched) {
    if (entry.reason !== void 0) {
      failures.push({ src: entry.src, reason: entry.reason });
      continue;
    }
    const bytes = entry.kept?.bytes ?? entry.image.data.byteLength;
    const count = uses.get(entry.src) ?? 1;
    if (bytes * count > budget) {
      failures.push({
        src: entry.src,
        reason: count === 1 ? cardBudgetReason(limits) : `${cardBudgetReason(limits)} \u2014 it is referenced ${count} times and every reference embeds a full copy, so reference it once or use a smaller image`
      });
      continue;
    }
    budget -= bytes * count;
    if (entry.kept !== void 0) {
      images.push(entry.kept);
      continue;
    }
    const { data, type, origin } = entry.image;
    images.push({ src: entry.src, id: await store.put(data, type), type, bytes, origin });
  }
  failures.sort((a, b) => sources.indexOf(a.src) - sources.indexOf(b.src));
  return { images, failures };
}
function cardImageOf({ src, id, type, bytes }) {
  return { src, id, type, bytes };
}
async function resolveOne(src, options, limits) {
  const maxBytes = limits.maxImageBytes;
  const value = decodeEntities(src).trim();
  const target = classify(value);
  let data;
  try {
    if (target.kind === "url") {
      const signal = withTimeout(options.signal, limits.timeoutMs);
      data = await options.fetchUrl(target.url, signal, maxBytes);
    } else {
      data = await options.readFile(target.path, options.signal, maxBytes);
    }
  } catch (error) {
    if (error instanceof TooLarge) throw new ImageError(`larger than the ${mib(limits.maxImageBytes)} limit for one image`);
    throw error;
  }
  const type = sniffImageType(data);
  if (type === void 0) {
    throw new ImageError(`not a PNG, JPEG, GIF, WebP or SVG image (the content starts ${JSON.stringify(preview(data))})`);
  }
  return { data, type, origin: target.kind === "url" ? "url" : "file" };
}
function classify(value) {
  const scheme = /^([a-z][\w+.-]*):/iu.exec(value)?.[1]?.toLowerCase();
  if (value.startsWith("//")) return { kind: "url", url: parseUrl(`https:${value}`) };
  if (scheme === void 0 || scheme.length === 1) return { kind: "file", path: value };
  if (scheme === "http" || scheme === "https") return { kind: "url", url: parseUrl(value) };
  if (scheme === "data" || scheme === "blob") throw new ImageError(`a ${scheme}: URL already loads in the card; put it in src, not data-viz-src`);
  throw new ImageError(`${scheme}: URLs are not supported; use an http(s) URL or a path relative to the workspace root`);
}
function parseUrl(value) {
  try {
    return new URL(value);
  } catch {
    throw new ImageError("not a valid URL");
  }
}
var TooLarge = class extends Error {
};
function cardBudgetReason(limits) {
  return `the card's images would exceed the ${mib(limits.maxCardBytes)} limit for one card; use smaller images or fewer of them`;
}
function mib(bytes) {
  return `${Math.round(bytes / 1024 / 102.4) / 10} MB`;
}
function reasonOf(error) {
  if (error instanceof ImageError) return error.message;
  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) return "timed out";
  const message = error instanceof Error ? error.message : String(error);
  return message.split("\n")[0].slice(0, 200);
}
function preview(data) {
  return Array.from(data.subarray(0, 16), (byte) => byte >= 32 && byte < 127 ? String.fromCharCode(byte) : ".").join("");
}
function withTimeout(signal, ms) {
  return AbortSignal.any([signal, AbortSignal.timeout(ms)]);
}
var ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
function decodeEntities(value) {
  return value.replaceAll(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/giu, (whole, dec, hex, name2) => {
    if (name2 !== void 0) return ENTITIES[name2.toLowerCase()] ?? whole;
    const code = Number.parseInt(dec ?? hex, dec === void 0 ? 16 : 10);
    return code > 0 && code <= 1114111 ? String.fromCodePoint(code) : whole;
  });
}
function bytesAt(data, offset, expected) {
  const codes = typeof expected === "string" ? Array.from(expected, (c) => c.charCodeAt(0)) : expected;
  return data.byteLength >= offset + codes.length && codes.every((byte, i) => data[offset + i] === byte);
}
var SVG_START = /^﻿?\s*(?:<\?xml[^>]*>\s*)?(?:(?:<!--[\s\S]*?-->|<!doctype[^>[]*(?:\[[\s\S]*?\])?\s*>)\s*)*<svg[\s>/]/iu;
function sniffImageType(data) {
  if (bytesAt(data, 0, [137, 80, 78, 71, 13, 10, 26, 10])) return "image/png";
  if (bytesAt(data, 0, [255, 216, 255])) return "image/jpeg";
  if (bytesAt(data, 0, "GIF87a") || bytesAt(data, 0, "GIF89a")) return "image/gif";
  if (bytesAt(data, 0, "RIFF") && bytesAt(data, 8, "WEBP")) return "image/webp";
  const head = new TextDecoder("utf-8", { fatal: false }).decode(data.subarray(0, 4096));
  return SVG_START.test(head) ? "image/svg+xml" : void 0;
}
function workspaceImageReader(ctx, root) {
  return async (path, signal, maxBytes) => {
    if (root === void 0) throw new ImageError("this conversation has no workspace to read files from");
    if (path === "~" || path.startsWith("~/")) {
      throw new ImageError("~ is not expanded; give the path relative to the workspace root");
    }
    const base = resolvePath(root);
    const lexical = resolvePath(base, path);
    if (!inside(base, lexical)) throw new ImageError("outside the workspace; only files inside the workspace can be embedded");
    const fs = ctx.fs;
    if (typeof fs?.resolve !== "function" || typeof fs.contains !== "function" || typeof fs.stat !== "function" || typeof fs.readBytes !== "function") {
      throw new ImageError("this dsh host cannot read binary workspace files; save the image somewhere with an https URL instead");
    }
    const opts = { cwd: base, signal };
    const [rootTarget, target] = await Promise.all([fs.resolve(base, opts), fs.resolve(lexical, opts)]);
    if (!fs.contains(rootTarget, target)) {
      throw new ImageError("resolves outside the workspace through a symlink; only files inside the workspace can be embedded");
    }
    const info = await fs.stat(target, signal);
    if (info === void 0) throw new ImageError("not found in the workspace; check the path relative to the workspace root");
    if (info.type !== "file") throw new ImageError("not a regular file");
    if (info.size !== void 0 && info.size > maxBytes) throw new TooLarge();
    try {
      return await fs.readBytes(target, signal, maxBytes);
    } catch (error) {
      if (error.code === "FS_TOO_LARGE") throw new TooLarge();
      throw error;
    }
  };
}
var NON_PUBLIC = (() => {
  const list = new BlockList();
  for (const [net, prefix] of [
    ["0.0.0.0", 8],
    ["10.0.0.0", 8],
    ["100.64.0.0", 10],
    ["127.0.0.0", 8],
    ["169.254.0.0", 16],
    ["172.16.0.0", 12],
    ["192.0.0.0", 24],
    ["192.0.2.0", 24],
    ["192.88.99.0", 24],
    ["192.168.0.0", 16],
    ["198.18.0.0", 15],
    ["198.51.100.0", 24],
    ["203.0.113.0", 24],
    ["224.0.0.0", 4],
    ["240.0.0.0", 4]
  ]) list.addSubnet(net, prefix, "ipv4");
  for (const [net, prefix] of [
    ["::", 96],
    ["64:ff9b:1::", 48],
    ["100::", 64],
    ["2001::", 23],
    ["2001:db8::", 32],
    ["2002::", 16],
    ["fc00::", 7],
    ["fe80::", 10],
    ["fec0::", 10],
    ["ff00::", 8]
  ]) list.addSubnet(net, prefix, "ipv6");
  return list;
})();
function isPublicAddress(address, family) {
  if (family === 4) return !NON_PUBLIC.check(address, "ipv4");
  const groups = ipv6Groups(address);
  if (groups === void 0) return false;
  const embedded = groups[0] === 0 && groups[1] === 0 && groups[2] === 0 && groups[3] === 0 && groups[4] === 0 && groups[5] === 65535 || groups[0] === 100 && groups[1] === 65435 && groups.slice(2, 6).every((g) => g === 0);
  if (embedded) return isPublicAddress(`${groups[6] >> 8}.${groups[6] & 255}.${groups[7] >> 8}.${groups[7] & 255}`, 4);
  return !NON_PUBLIC.check(address, "ipv6");
}
function ipv6Groups(address) {
  let text = address.toLowerCase().replace(/%.*$/u, "");
  const dotted = /(\d+)\.(\d+)\.(\d+)\.(\d+)$/u.exec(text);
  if (dotted !== null) {
    const [a, b, c, d] = dotted.slice(1).map(Number);
    text = `${text.slice(0, dotted.index)}${(a << 8 | b).toString(16)}:${(c << 8 | d).toString(16)}`;
  }
  const halves = text.split("::");
  if (halves.length > 2) return void 0;
  const parse = (part) => part === "" ? [] : part.split(":").map((g) => Number.parseInt(g, 16));
  const head = parse(halves[0]);
  const tail = halves.length === 2 ? parse(halves[1]) : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  const groups = [...head, ...Array.from({ length: fill }, () => 0), ...tail];
  return groups.length === 8 && groups.every((g) => Number.isInteger(g) && g >= 0 && g <= 65535) ? groups : void 0;
}
var publicOnly = isPublicAddress;
function urlFetcher(options) {
  const policy = options.policy ?? publicOnly;
  return async (url, signal, maxBytes) => {
    let current = url;
    for (let hop = 0; ; hop += 1) {
      checkUrl(current, policy);
      const response = await get(current, policy, signal);
      const status = response.statusCode ?? 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        response.destroy();
        const location = response.headers.location;
        if (location === void 0) throw new ImageError(`HTTP ${status} without a Location header`);
        if (hop >= options.maxRedirects) throw new ImageError(`more than ${options.maxRedirects} redirects`);
        current = parseUrl(new URL(location, current).href);
        continue;
      }
      if (status !== 200) {
        response.destroy();
        throw new ImageError(`the server answered HTTP ${status}`);
      }
      const encoding = response.headers["content-encoding"];
      if (encoding !== void 0 && encoding !== "identity") {
        response.destroy();
        throw new ImageError(`the server sent a ${encoding}-encoded body, which is not decoded here`);
      }
      const length = Number(response.headers["content-length"]);
      if (Number.isFinite(length) && length > maxBytes) {
        response.destroy();
        throw new TooLarge();
      }
      return await readBody(response, maxBytes);
    }
  };
}
function checkUrl(url, policy) {
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new ImageError(`redirected to a ${url.protocol} URL, which is not fetched`);
  if (url.username !== "" || url.password !== "") throw new ImageError("URLs with credentials are not fetched");
  const host = url.hostname.replace(/^\[|\]$/gu, "");
  const family = isIP(host);
  if (family !== 0 && !policy(host, family)) throw new ImageError(blockedReason(url.hostname, host));
}
function blockedReason(hostname, address) {
  return `${hostname} is ${hostname === address ? "" : `${address}, `}a loopback, private or link-local address; card images are fetched from the public internet only \u2014 save a local image into the workspace and give its path`;
}
function guardedLookup(policy) {
  return (hostname, options, callback) => {
    dnsLookup(hostname, { ...options, all: true }, (error, addresses) => {
      if (error !== null) return callback(error);
      const blocked = addresses.find((entry) => !policy(entry.address, entry.family));
      if (blocked !== void 0 || addresses.length === 0) {
        return callback(new ImageError(blocked === void 0 ? `${hostname} has no address` : blockedReason(hostname, blocked.address)));
      }
      if (options.all === true) return callback(null, addresses);
      callback(null, addresses[0].address, addresses[0].family);
    });
  };
}
async function get(url, policy, signal) {
  const request = url.protocol === "https:" ? httpsRequest : httpRequest;
  return await new Promise((resolve4, reject) => {
    const req = request(url, {
      method: "GET",
      agent: false,
      lookup: guardedLookup(policy),
      signal,
      headers: {
        "accept": "image/png,image/jpeg,image/gif,image/webp,image/svg+xml;q=0.9,*/*;q=0.1",
        "accept-encoding": "identity",
        "user-agent": "dsh-visualize"
      }
    }, resolve4);
    req.on("error", (error) => reject(error instanceof ImageError ? error : error.cause instanceof ImageError ? error.cause : error));
    req.end();
  });
}
async function readBody(response, maxBytes) {
  const chunks = [];
  let total = 0;
  for await (const chunk of response) {
    total += chunk.byteLength;
    if (total > maxBytes) {
      response.destroy();
      throw new TooLarge();
    }
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);
  return new Uint8Array(body.buffer, body.byteOffset, body.byteLength);
}
function imageReport(images, failures) {
  if (images.length === 0 && failures.length === 0) return void 0;
  const kb = Math.ceil(images.reduce((sum, image) => sum + image.bytes, 0) / 1024);
  const embedded = images.length === 0 ? "" : `Embedded ${images.length} image${images.length === 1 ? "" : "s"} (${kb} KB, stored beside the card).`;
  if (failures.length === 0) return embedded;
  const head = `${failures.length} image${failures.length === 1 ? "" : "s"} could not be embedded and show${failures.length === 1 ? "s" : ""} a placeholder; fix each data-viz-src and patch the card:`;
  const lines = failures.map((failure) => `- ${JSON.stringify(failure.src)}: ${failure.reason}`);
  return [embedded, head].filter((part) => part.length > 0).join(" ") + "\n" + lines.join("\n");
}

// src/skill.ts
import { readFile as readFile3 } from "node:fs/promises";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import {
  BUNDLED_SKILL_RANK
} from "@deepseek-ai/dsh-skill";

// src/style-guide.ts
import { readFile as readFile2 } from "node:fs/promises";
import { join as join3 } from "node:path";
import { fileURLToPath } from "node:url";
var CUSTOM_STYLE_MAX_BYTES = 4096;
var GLOBAL_STYLE_FILE = "style.md";
var WORKSPACE_STYLE_FILE = join3(".dsh", "visualize-style.md");
var STYLE_DIR_URL = new URL("../assets/styles/", import.meta.url);
function styleGuidePath(style) {
  return fileURLToPath(new URL(`${style}.md`, STYLE_DIR_URL));
}
function styleFileLocations(ctx, workspace) {
  return { home: storeRoot(ctx), workspace };
}
async function readCustomStyles(locations) {
  const candidates = [];
  if (locations.home !== void 0) candidates.push({ scope: "global", path: join3(locations.home, GLOBAL_STYLE_FILE) });
  if (locations.workspace !== void 0 && locations.workspace.length > 0) {
    candidates.push({ scope: "workspace", path: join3(locations.workspace, WORKSPACE_STYLE_FILE) });
  }
  const found = [];
  for (const candidate of candidates) {
    const bytes = await readFile2(candidate.path).catch(() => void 0);
    if (bytes === void 0) continue;
    const truncated = bytes.byteLength > CUSTOM_STYLE_MAX_BYTES;
    const text = (truncated ? bytes.subarray(0, CUSTOM_STYLE_MAX_BYTES) : bytes).toString("utf8").replace(/�+$/u, "").trim();
    if (text.length === 0) continue;
    found.push({ ...candidate, text, truncated });
  }
  return found;
}
async function activeStyleSection(style, locations) {
  const guide = (await readFile2(styleGuidePath(style), "utf8")).trim();
  const custom = await readCustomStyles(locations);
  const parts = [
    "",
    "## Active card style",
    "",
    `The user's card style is \`${style}\` (${STYLES[style].label}). The frame already applies its colours, fonts, radius and chart defaults; the guide below says how a card in this style should read. It follows the precedence and limits in "Card style" above.`,
    "",
    `### Built-in style: ${style}`,
    "",
    guide
  ];
  for (const file of custom) {
    parts.push(
      "",
      file.scope === "global" ? `### User style (global, ${file.path})` : `### User style (this workspace, ${file.path})`,
      "",
      file.text
    );
    if (file.truncated) {
      parts.push("", `(The file is longer than ${CUSTOM_STYLE_MAX_BYTES} bytes; only its start is shown.)`);
    }
  }
  return `${parts.join("\n")}
`;
}
function styleToolNote(style) {
  return ` Cards use the user's "${style}" card style: its guide is appended to the visualize skill, or read it from ${styleGuidePath(style)} together with any user style file (${join3("<DSH_HOME>", "visualize", GLOBAL_STYLE_FILE)}, then ${join3("<workspace>", WORKSPACE_STYLE_FILE)}).`;
}

// src/skill.ts
var PROVIDER_NAME = "dsh-visualize";
var SKILL_BODY_URL = new URL("../assets/visualize-skill.md", import.meta.url);
var SKILL_BODY_PATH = fileURLToPath2(SKILL_BODY_URL);
var SKILL_RESOURCE_DIR = fileURLToPath2(new URL("../assets/", import.meta.url));
var RESOURCE_BASE = {
  kind: "directory",
  path: SKILL_RESOURCE_DIR
};
var INVOCATION = { modelInvocable: true, userInvocable: true };
var DESCRIPTION = "Authoring contract for the visualize tool, which renders interactive cards in the conversation, or full pages in their own tab: simulations, algorithm walkthroughs, charts, comparisons, dashboards, and product-screen mockups. Load before the first visualize call in a session \u2014 it defines the fragment structure, theming variables, size ceiling, and allowed resources the tool validates against.";
var CANDIDATE = {
  name: "visualize",
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: "bundled",
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL
};
function visualizeSkillProvider(style = DEFAULT_STYLE, locate = () => ({})) {
  return {
    name: PROVIDER_NAME,
    list: () => Promise.resolve([CANDIDATE]),
    async get(_candidate, options) {
      const body = await readFile3(SKILL_BODY_URL, "utf8");
      return {
        name: CANDIDATE.name,
        description: CANDIDATE.description,
        invocation: CANDIDATE.invocation,
        provider: CANDIDATE.provider,
        source: CANDIDATE.source,
        resourceBase: RESOURCE_BASE,
        content: body + await activeStyleSection(typeof style === "function" ? style() : style, locate(options?.cwd))
      };
    }
  };
}

// src/lint-gate.ts
var STOP_AFTER = 3;
var MAX_SESSIONS = 256;
var FragmentLintGate = class {
  streaks = /* @__PURE__ */ new Map();
  /**
   * Lint one fragment and decide.
   * @param input - fragment, size ceiling, session, and the pre-patch card for updates.
   * @returns the size and warning text when nothing blocks the card.
   * @throws Error with the coded findings when any error remains.
   */
  check(input) {
    const { sizeBytes, findings } = lintFragment(input.fragment, input.maxBytes);
    const placed = input.base === void 0 ? findings.map((finding) => ({ finding, origin: "new" })) : placeAgainstBase(findings, input.fragment, input.base, input.maxBytes);
    const blocking = (p) => p.finding.severity === "error" && p.origin !== "preexisting";
    const errors = placed.filter(blocking);
    const warnings = placed.filter((p) => !blocking(p));
    const patched = input.base !== void 0;
    if (errors.length === 0) {
      if (input.sessionId !== void 0) this.streaks.delete(input.sessionId);
      return {
        sizeBytes,
        warnings: warnings.length === 0 ? "" : `Lint warnings (the card rendered; patch these if they matter, positions are line:column in the ${patched ? "patched card" : "fragment"}):
${formatFindings(warnings)}`
      };
    }
    let message = formatRejection(errors, warnings, patched);
    if (input.sessionId !== void 0) {
      const stuck = this.recordRejection(input.sessionId, new Set(errors.map((p) => p.finding.code)));
      if (stuck.length > 0) {
        const named = stuck.map((code) => `${code} (${LINT_RULES[code].message})`).join("; ");
        message += `

STOP: ${stuck.join(", ")} has now rejected ${STOP_AFTER} visualize calls in a row. Do not call visualize again for this card. Tell the user in your reply what is blocking it \u2014 ${named} \u2014 and ask how they want to proceed.`;
      }
    }
    throw new Error(message);
  }
  /**
   * Advance the session's streaks: codes in this rejection grow by one,
   * codes absent from it reset.
   * @returns codes whose streak has reached {@link STOP_AFTER}.
   */
  recordRejection(sessionId, codes) {
    const previous = this.streaks.get(sessionId);
    const next = /* @__PURE__ */ new Map();
    for (const code of codes) next.set(code, (previous?.get(code) ?? 0) + 1);
    this.streaks.delete(sessionId);
    this.streaks.set(sessionId, next);
    if (this.streaks.size > MAX_SESSIONS) {
      const oldest = this.streaks.keys().next().value;
      if (oldest !== void 0) this.streaks.delete(oldest);
    }
    return [...next].filter(([, count]) => count >= STOP_AFTER).map(([code]) => code);
  }
};
function placeAgainstBase(findings, patched, base, maxBytes) {
  let prefix = 0;
  const limit = Math.min(base.length, patched.length);
  while (prefix < limit && base[prefix] === patched[prefix]) prefix++;
  let suffix = 0;
  while (suffix < limit - prefix && base[base.length - 1 - suffix] === patched[patched.length - 1 - suffix]) suffix++;
  const editStart = prefix;
  const editEnd = Math.max(prefix, patched.length - suffix);
  const before = /* @__PURE__ */ new Set();
  for (const f of lintFragment(base, maxBytes).findings) before.add(findingKey(f, f.offset, base));
  const shift = patched.length - base.length;
  return findings.map((finding) => {
    const start = finding.offset;
    const end = finding.offset + finding.length;
    const inEdit = editEnd > editStart ? start < editEnd && end > editStart : start < editStart && end > editStart;
    if (inEdit) return { finding, origin: "edit" };
    const baseOffset = end <= editStart ? start : start - shift;
    if (finding.code !== "VZ002" && before.has(findingKey(finding, baseOffset, patched, start))) {
      return { finding, origin: "preexisting" };
    }
    return { finding, origin: "new" };
  });
}
function findingKey(finding, at, src, from = at) {
  return `${finding.code}\0${finding.severity}\0${at}\0${src.slice(from, from + finding.length)}`;
}

// src/tool.ts
var DESCRIPTION2 = `Show the user an interactive HTML visualization, rendered as a live card in the conversation. \`create\` (the default) takes the whole markup in \`fragment\`: literal inline HTML only (no <!doctype>, <html>, <head>, or <body> \u2014 the card supplies the document, stylesheet, and theme). To correct a card you already rendered, call \`update\` with its \`path\` and one exact \`old_str\`/\`new_str\` replacement instead of re-sending the whole fragment. \`mode: "page"\` builds a full standalone page instead of a chat card: the conversation shows a launcher with a live thumbnail, and the user opens the page in its own browser tab. The card appears while you generate; a copy of the finished fragment is saved outside the project, per session. Load the \`visualize\` skill for the authoring contract before your first call. If this session has no skill tool, read the same contract from ${SKILL_BODY_PATH} (its relative paths resolve against ${SKILL_RESOURCE_DIR}) with a file or shell tool; do not search for it anywhere else.`;
var NO_IMAGE_ROUTE = "this dsh host cannot deliver images to cards (the image route needs dsh 0.1.7 or later)";
function visualizeTool(ctx, maxFragmentBytes, style = DEFAULT_STYLE, images = { delivery: () => false }) {
  const lint = new FragmentLintGate();
  const currentStyle = typeof style === "function" ? style : () => style;
  const imageLimits = images.limits ?? DEFAULT_IMAGE_LIMITS;
  const fetchUrl = images.fetchUrl ?? urlFetcher({ maxRedirects: imageLimits.maxRedirects });
  return defineTool({
    name: VISUALIZE_TOOL_NAME,
    description: DESCRIPTION2 + styleToolNote(currentStyle()),
    parameters: {
      action: {
        type: "string",
        enum: ["create", "update"],
        description: "`create` (default) renders a new card from `fragment`. `update` patches the card at `path`, replacing `old_str` with `new_str` \u2014 use it for a correction touching fewer than 20 lines in fewer than 5 places, and at most 4 times per reply; re-create the card for anything larger."
      },
      fragment: {
        type: "string",
        description: 'create only, required: the inline HTML fragment to render (markup, style, and script \u2014 no document skeleton). For a workspace image or a web image off the CDN allowlist, write <img data-viz-src="figs/plot.png"> or <img data-viz-src="https://\u2026"> and the tool embeds it.'
      },
      title: {
        type: "string",
        description: 'Concise card title. Defaults to "Visualization" on create; required on update.'
      },
      mode: {
        type: "string",
        enum: [...VISUALIZE_MODES],
        description: "Surface: `inline` (default) fits the chat column; `wide` for compact panels that must sit side by side; `page` for a full standalone page (\u22651280px wide, any height) the user opens in its own tab from a launcher card. On update, restate the mode the card was created with."
      },
      summary: {
        type: "string",
        description: "page mode: one short line under the launcher title saying what the page lets the user do. Restate it on update."
      },
      path: {
        type: "string",
        description: "update only, required: path of the card to patch, exactly as its own call reported it."
      },
      old_str: {
        type: "string",
        description: "update only, required: the exact card text to replace, whitespace included. It must appear exactly once \u2014 keep it as short as stays unique."
      },
      new_str: {
        type: "string",
        description: "update only, required: the replacement text. Empty deletes the matched region."
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: { type: "string", required: true, enum: ["create", "update"] },
          path: { type: "string", required: true },
          title: { type: "string", required: true },
          mode: { type: "string", required: true, enum: [...VISUALIZE_MODES] },
          summary: { type: "string" },
          sizeBytes: { type: "integer", required: true },
          fragment: { type: "string", required: true },
          warnings: { type: "string" },
          style: { type: "string" },
          images: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                src: { type: "string", required: true },
                id: { type: "string", required: true },
                type: { type: "string", required: true },
                bytes: { type: "integer", required: true }
              }
            }
          },
          imageReport: { type: "string" }
        }
      },
      // Model-facing text stays a confirmation: the fragment is already in the
      // model's own output (the argument, whole or patched) and re-echoing it
      // would double its context cost. The patched path is named so a further
      // correction patches the new card rather than the superseded one.
      // Image bytes never enter the result: the report names what was
      // embedded and, per failed image, why.
      render: (_args, value) => [
        {
          type: "text",
          text: resultText(value)
        },
        ...value.warnings ? [{ type: "text", text: value.warnings }] : [],
        ...value.imageReport ? [{ type: "text", text: value.imageReport }] : []
      ],
      // Project the fragment into persisted meta so the card survives replay:
      // the canonical value is not on the wire, only content + meta are.
      presentationMeta: (_args, value) => ({
        kind: "visualize",
        fragment: encodeWireFragment(value.fragment),
        title: value.title,
        mode: value.mode,
        path: value.path,
        ...value.summary === void 0 ? {} : { summary: value.summary },
        style: value.style ?? DEFAULT_STYLE,
        // References only; the card fetches the bytes from the image route.
        ...value.images?.length ? { images: value.images } : {}
      })
    },
    // A create writes only a content-addressed card file; concurrent
    // siblings target distinct names or identical bytes, so they cannot
    // conflict. An update reads a card before rewriting it, so parallel
    // updates would each patch a base the other has already superseded.
    isConcurrencySafe: (args) => (args.action ?? "create") === "create",
    async execute(args, exec) {
      const action = args.action ?? "create";
      let mode = modeOf(args.mode, args.path !== void 0 && action === "update" && args.path.endsWith(PAGE_SUFFIX));
      const store = cardStore(ctx, exec);
      let source;
      let properties;
      let fragment;
      let base;
      if (action === "update") {
        source = await store.open(required(args.path, "path", action));
        base = await source.read();
        properties = await source.readMetadata(base);
        mode = modeOf(args.mode ?? properties?.mode, args.path !== void 0 && args.path.endsWith(PAGE_SUFFIX));
        fragment = applyFragmentPatch(
          base,
          required(args.old_str, "old_str", action),
          present(args.new_str, "new_str", action)
        );
      } else {
        fragment = required(args.fragment, "fragment", action);
      }
      const { sizeBytes, warnings } = lint.check({ fragment, maxBytes: Math.min(maxFragmentBytes, MAX_META_FRAGMENT_BYTES), sessionId: exec.agent?.session.header?.id, base });
      const title = action === "update" ? required(args.title, "title", action).trim() : args.title?.trim() || "Visualization";
      const summary = args.summary === void 0 ? properties?.summary : args.summary.replaceAll(/\s+/gu, " ").trim().slice(0, MAX_SUMMARY_CHARS);
      const configured = currentStyle();
      const cardStyle = action === "update" ? properties?.style ?? styleOfCardPath(args.path) ?? configured : configured;
      const suffix = mode === "page" ? PAGE_SUFFIX : ".html";
      const target = source ?? await store.create(`${slugOf(title)}-${contentHash(fragment)}.${cardStyle}${suffix}`);
      const previous = action === "update" ? await target.images?.read() ?? [] : [];
      const resolved = await resolveCardImages(fragment, {
        readFile: workspaceImageReader(ctx, store.workspaceRoot),
        fetchUrl,
        store: store.images,
        ...images.delivery() ? {} : { unavailable: NO_IMAGE_ROUTE },
        previous,
        limits: imageLimits,
        signal: exec.signal
      });
      const signal = exec.signal;
      signal?.throwIfAborted();
      await target.write(fragment, { title, mode, style: cardStyle, ...summary === void 0 ? {} : { summary } }, base);
      await target.images?.write(resolved.images);
      const embedded = resolved.images.map(cardImageOf);
      const report = imageReport(embedded, resolved.failures);
      return {
        action,
        path: target.displayPath,
        title,
        mode,
        sizeBytes,
        fragment,
        ...summary ? { summary } : {},
        style: cardStyle,
        ...warnings ? { warnings } : {},
        ...embedded.length > 0 ? { images: embedded } : {},
        ...report === void 0 ? {} : { imageReport: report }
      };
    },
    presentCall: () => ({
      card: "generic",
      title: "Visualize",
      kind: "other"
    }),
    // The completed title derives from persisted meta, not args, so replay of
    // a defaulted title still shows the resolved one. A malformed or absent
    // meta declines to the generic fallback.
    presentResult(_args, result) {
      if (result.isError) return void 0;
      const meta = visualizeMetaFrom(result.meta);
      if (meta === void 0) return void 0;
      return { card: "generic", title: `Visualization \xB7 ${meta.title}` };
    }
  });
}
var PAGE_SUFFIX = ".page.html";
var CARD_STYLE_PATTERN = new RegExp(`-[0-9a-f]{8}\\.(${STYLE_IDS.join("|")})(?:\\.page)?\\.html$`, "u");
function styleOfCardPath(path) {
  return CARD_STYLE_PATTERN.exec(path)?.[1];
}
var MAX_SUMMARY_CHARS = 200;
function modeOf(value, pageFile) {
  if (value === void 0) return pageFile ? "page" : "inline";
  if (!isVisualizeMode(value)) {
    throw new Error(`invalid visualization: \`mode\` must be one of ${VISUALIZE_MODES.map((m) => `"${m}"`).join(", ")}`);
  }
  return value;
}
function resultText(value) {
  if (value.mode === "page") {
    return value.action === "update" ? `Patched page "${value.title}" in place (${value.sizeBytes} bytes; updated card at ${value.path}). The launcher in the conversation now opens the corrected page; a tab the user already opened keeps the old version until they open it again. Patch that path for any further correction.` : `Rendered "${value.title}" as a page (${value.sizeBytes} bytes; saved copy at ${value.path}). The conversation shows a launcher card with a live thumbnail; the user opens the full page in its own tab from its button.`;
  }
  return value.action === "update" ? `Patched "${value.title}" in place (${value.sizeBytes} bytes; updated card at ${value.path}). The user sees the corrected visualization in the conversation; patch that path for any further correction.` : `Rendered "${value.title}" inline (${value.sizeBytes} bytes; saved copy at ${value.path}). The user sees the interactive visualization in the conversation.`;
}
function required(value, name2, action) {
  if (value === void 0 || value.trim().length === 0) {
    throw new Error(`invalid visualization: \`${name2}\` is required when action is "${action}"`);
  }
  return value;
}
function present(value, name2, action) {
  if (value === void 0) {
    throw new Error(`invalid visualization: \`${name2}\` is required when action is "${action}"`);
  }
  return value;
}
function slugOf(title) {
  const slug = title.toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-").replaceAll(/^-+|-+$/gu, "").slice(0, 48);
  return slug.length > 0 ? slug : "visualization";
}
function contentHash(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// src/style-setting.ts
import z from "@deepseek-ai/schemastery";
function styleFieldSchema(schema = z) {
  const field = schema.union(STYLE_IDS.map((id) => schema.const(id).description(STYLES[id].label))).default(DEFAULT_STYLE).description("Card style \xB7 \u5361\u7247\u98CE\u683C");
  return typeof field.volatile === "function" ? field.volatile() : field;
}
function readStyle(setting) {
  if (typeof setting === "object" && setting !== null && typeof setting.get === "function") {
    return styleIdFrom(setting.get());
  }
  return styleIdFrom(setting);
}

// src/style-files.ts
import { lstat as lstat4, readFile as readFile4, rm as rm2 } from "node:fs/promises";
import { dirname as dirname3, join as join4, resolve as resolve3 } from "node:path";
var MAX_SHOWN_BYTES = 64 * 1024;
function styleFilesHost(ctx) {
  return {
    home: storeRoot(ctx),
    workspaces() {
      let registry;
      try {
        registry = ctx.get("workspaceRegistry");
      } catch {
        return [];
      }
      const list = registry?.list;
      if (typeof list !== "function") return [];
      const rows = list.call(registry);
      if (!Array.isArray(rows)) return [];
      return rows.flatMap((row) => typeof row?.id === "string" && typeof row.path === "string" ? [{ id: row.id, path: row.path, ...typeof row.title === "string" ? { title: row.title } : {} }] : []);
    }
  };
}
function targets(host) {
  if (host.home === void 0) return [];
  const list = [{ scope: "global", path: join4(host.home, GLOBAL_STYLE_FILE), root: host.home }];
  for (const workspace of host.workspaces()) {
    const root = resolve3(workspace.path);
    list.push({ scope: "workspace", path: join4(root, WORKSPACE_STYLE_FILE), root, workspace });
  }
  return list;
}
function targetOf(host, scope, workspaceId) {
  return targets(host).find((target) => target.scope === scope && (scope === "global" || target.workspace?.id === workspaceId));
}
async function blockOf(target) {
  const realRoot = await realpathOfDeepest(target.root);
  const dir = await realpathOfDeepest(dirname3(target.path));
  if (dir !== realRoot && !inside(realRoot, dir)) return { blocked: "outside" };
  const stat = await lstat4(target.path).catch(() => void 0);
  if (stat === void 0) return {};
  if (stat.isSymbolicLink()) return { blocked: "symlink", size: 0 };
  if (!stat.isFile()) return { blocked: "not-a-file", size: 0 };
  return { size: stat.size };
}
async function viewOf(target) {
  const base = {
    scope: target.scope,
    path: target.path,
    ...target.workspace === void 0 ? {} : { workspaceId: target.workspace.id, ...target.workspace.title === void 0 ? {} : { title: target.workspace.title } }
  };
  const { blocked, size } = await blockOf(target);
  if (blocked !== void 0) return { ...base, exists: size !== void 0, text: "", bytes: 0, blocked };
  if (size === void 0) return { ...base, exists: false, text: "", bytes: 0 };
  const bytes = await readFile4(target.path).catch(() => void 0);
  if (bytes === void 0) return { ...base, exists: false, text: "", bytes: 0 };
  const text = bytes.subarray(0, MAX_SHOWN_BYTES).toString("utf8").replace(/�+$/u, "");
  return { ...base, exists: true, text, bytes: bytes.byteLength };
}
async function listStyleFiles(host) {
  return { maxBytes: CUSTOM_STYLE_MAX_BYTES, files: await Promise.all(targets(host).map(viewOf)) };
}
var StyleFileError = class extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
};
async function saveStyleFile(host, body) {
  const request = typeof body === "object" && body !== null ? body : {};
  if (typeof request.text !== "string") throw new StyleFileError(400, "invalid-text", "`text` must be a string");
  const target = targetOf(host, request.scope, request.workspaceId);
  if (target === void 0) throw new StyleFileError(404, "unknown-file", "no such style file");
  const size = Buffer.byteLength(request.text, "utf8");
  if (size > CUSTOM_STYLE_MAX_BYTES) {
    throw new StyleFileError(413, "too-large", `style file is ${size} bytes; the limit is ${CUSTOM_STYLE_MAX_BYTES}`);
  }
  const { blocked } = await blockOf(target);
  if (blocked !== void 0) throw new StyleFileError(409, blocked, `${target.path} cannot be edited here (${blocked})`);
  if (request.text.trim().length === 0) await rm2(target.path, { force: true });
  else await writeFileAtomic(target.path, request.text);
  return await viewOf(target);
}
function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
async function handleStyleFiles(host, request) {
  if (request.method === "GET") return json(200, await listStyleFiles(host));
  if (request.method !== "POST") return json(405, { error: "method-not-allowed" });
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json(415, { error: "unsupported-media-type" });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid-json" });
  }
  try {
    return json(200, await saveStyleFile(host, body));
  } catch (error) {
    if (error instanceof StyleFileError) return json(error.status, { error: error.code, message: error.message });
    throw error;
  }
}

// src/storage-retention.ts
import { lstat as lstat5, opendir, rmdir, unlink as unlink3 } from "node:fs/promises";
import { basename as basename2, dirname as dirname4, join as join5 } from "node:path";
var DAY_MS = 24 * 60 * 60 * 1e3;
var SESSION_NAME = /^(?:[A-Za-z0-9_-]|~[0-9a-f]{6})+$/u;
var CARD_NAME = /^[a-z0-9][a-z0-9._-]*\.html$/u;
var META_NAME = /^[a-z0-9][a-z0-9._-]*\.html\.meta\.json$/u;
var MAX_SESSIONS2 = 1e5;
var MAX_FILES_PER_SESSION = 1e3;
function fingerprint(info) {
  return [info.dev, info.ino, info.size, info.mtimeMs, info.ctimeMs, info.nlink].join(":");
}
function validRoot(root) {
  const absolute = checkedStoreRoot(root);
  if (basename2(absolute) !== "visualize" || dirname4(absolute) === absolute) {
    throw new Error("retention root must be the explicit visualize store directory");
  }
  return absolute;
}
async function inspectSession(dir) {
  const dirInfo = await lstat5(dir);
  if (dirInfo.isSymbolicLink()) return "link";
  if (!dirInfo.isDirectory()) return "unknown-file";
  const files = [];
  let newest = dirInfo.mtimeMs;
  for await (const entry of await opendir(dir)) {
    if (files.length >= MAX_FILES_PER_SESSION) return "unknown-file";
    const path = join5(dir, entry.name);
    const info = await lstat5(path);
    if (info.isSymbolicLink()) return "link";
    if (info.isDirectory()) return "subdirectory";
    if (!info.isFile()) return "unknown-file";
    if (!CARD_NAME.test(entry.name) && !META_NAME.test(entry.name)) {
      if (entry.name.endsWith(".lock")) return "lock";
      if (entry.name.endsWith(".tmp")) return "temporary";
      return "unknown-file";
    }
    if (info.nlink !== 1) return "hard-link";
    files.push({ name: entry.name, path, fingerprint: fingerprint(info), size: info.size, mtimeMs: info.mtimeMs });
    newest = Math.max(newest, info.mtimeMs);
  }
  return { dir, dirMtimeMs: dirInfo.mtimeMs, files, newest };
}
function unchanged(before, after) {
  return after.isFile() && after.nlink === 1 && fingerprint(after) === before.fingerprint;
}
async function pruneExpiredSessions(root, options = {}) {
  const absolute = validRoot(root);
  const retentionDays = options.retentionDays ?? 90;
  if (!Number.isSafeInteger(retentionDays) || retentionDays < 1) throw new Error("retention must be a whole number of days, at least 1");
  const maxSessions = options.maxSessions ?? MAX_SESSIONS2;
  if (!Number.isSafeInteger(maxSessions) || maxSessions < 1 || maxSessions > 1e5) throw new Error("invalid retention session limit");
  const now = options.now ?? Date.now();
  if (!Number.isSafeInteger(now) || now < 0) throw new Error("invalid retention clock");
  const cutoff = now - retentionDays * DAY_MS;
  const result = {
    root: absolute,
    retentionDays,
    cutoff,
    complete: true,
    pruned: [],
    preserved: [],
    removedFiles: 0
  };
  const sessionsDir = join5(absolute, "sessions");
  let sessionsInfo;
  try {
    sessionsInfo = await lstat5(sessionsDir);
  } catch (error) {
    if (isMissing(error)) return result;
    throw error;
  }
  if (sessionsInfo.isSymbolicLink()) throw new Error("visualization sessions directory must not be a link");
  if (!sessionsInfo.isDirectory()) throw new Error("visualization sessions path is not a directory");
  await assertPlainStorePath(absolute, sessionsDir);
  let inspected = 0;
  for await (const entry of await opendir(sessionsDir)) {
    if (inspected >= maxSessions) {
      result.complete = false;
      break;
    }
    inspected += 1;
    if (!SESSION_NAME.test(entry.name)) continue;
    const dir = join5(sessionsDir, entry.name);
    let snapshot;
    try {
      snapshot = await inspectSession(dir);
    } catch {
      result.preserved.push({ session: entry.name, reason: "unreadable" });
      continue;
    }
    if (typeof snapshot === "string") {
      result.preserved.push({ session: entry.name, reason: snapshot });
      continue;
    }
    if (snapshot.newest >= cutoff) {
      result.preserved.push({ session: entry.name, reason: "recent" });
      continue;
    }
    try {
      const before = await lstat5(dir);
      if (!before.isDirectory() || before.mtimeMs !== snapshot.dirMtimeMs) {
        result.preserved.push({ session: entry.name, reason: "changed" });
        continue;
      }
      const current = await Promise.all(snapshot.files.map(async (file) => await lstat5(file.path)));
      if (current.some((info, index) => !unchanged(snapshot.files[index], info))) {
        result.preserved.push({ session: entry.name, reason: "changed" });
        continue;
      }
      for (const file of snapshot.files) {
        await assertPlainStorePath(absolute, file.path);
        await unlink3(file.path);
        result.removedFiles += 1;
      }
      await rmdir(dir);
      result.pruned.push(entry.name);
    } catch (error) {
      result.preserved.push({ session: entry.name, reason: isMissing(error) ? "changed" : "unreadable" });
    }
  }
  return result;
}

// src/open-page.ts
import { randomBytes as randomBytes4 } from "node:crypto";
import { spawn } from "node:child_process";
import { createServer } from "node:http";

// src/open-protocol.ts
var OPEN_PAGE_PATH = "/api/visualize/open";
var MAX_OPEN_PAGE_BYTES = 4 * 1024 * 1024;
var OPEN_PAGE_TTL_MS = 60 * 60 * 1e3;

// src/open-page.ts
function json2(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
function reply(res, status, body, headers = {}) {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    ...headers
  });
  res.end(body);
}
function createOpenPageHost(options = {}) {
  const now = options.now ?? Date.now;
  const ttlMs = options.ttlMs ?? OPEN_PAGE_TTL_MS;
  const maxPages = options.maxPages ?? 16;
  const openExternal = options.openExternal ?? openWithSystemBrowser;
  const pages = /* @__PURE__ */ new Map();
  let server;
  let port = 0;
  let listening;
  const prune = () => {
    const time = now();
    for (const [token, page] of pages) if (page.expires <= time) pages.delete(token);
    while (pages.size > maxPages) {
      const oldest = pages.keys().next().value;
      if (oldest === void 0) break;
      pages.delete(oldest);
    }
  };
  const ensureServer = async () => {
    if (listening !== void 0) return await listening;
    server = createServer((req, res) => {
      void serve(req, res);
    });
    server.unref();
    listening = new Promise((resolve4, reject) => {
      server?.once("error", reject);
      server?.listen(0, "127.0.0.1", () => {
        const address = server?.address();
        if (address === null || address === void 0 || typeof address === "string") {
          reject(new Error("loopback page host did not get a port"));
          return;
        }
        port = address.port;
        resolve4();
      });
    });
    try {
      await listening;
    } catch (error) {
      server?.close();
      server = void 0;
      listening = void 0;
      throw error;
    }
  };
  const serve = (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      reply(res, 405, "method not allowed");
      return;
    }
    const path = (req.url ?? "").split("?", 1)[0] ?? "";
    const match = /^\/p\/([A-Za-z0-9_-]{16,128})$/u.exec(path);
    if (match === null) {
      reply(res, 404, "not found");
      return;
    }
    const page = pages.get(match[1]);
    if (page === void 0 || page.expires <= now()) {
      pages.delete(match[1]);
      reply(res, 404, "expired");
      return;
    }
    const frameAncestors = page.frameAncestor === void 0 ? "'none'" : `'self' ${page.frameAncestor}`;
    reply(res, 200, page.html, {
      "content-security-policy": `frame-ancestors ${frameAncestors}`
    });
  };
  return {
    async publish(html, title, frameAncestor) {
      if (typeof html !== "string" || Buffer.byteLength(html, "utf8") > MAX_OPEN_PAGE_BYTES) {
        throw new Error(`page exceeds ${MAX_OPEN_PAGE_BYTES} bytes`);
      }
      await ensureServer();
      prune();
      const token = randomBytes4(24).toString("base64url");
      pages.set(token, {
        html,
        title,
        expires: now() + ttlMs,
        ...frameAncestor === void 0 ? {} : { frameAncestor }
      });
      prune();
      return { url: `http://127.0.0.1:${port}/p/${token}`, token };
    },
    async openSystem(token) {
      const page = pages.get(token);
      if (page === void 0 || page.expires <= now()) return false;
      return await openExternal(`http://127.0.0.1:${port}/p/${token}`);
    },
    dispose() {
      pages.clear();
      server?.close();
      server = void 0;
      listening = void 0;
      port = 0;
    }
  };
}
async function openWithSystemBrowser(url) {
  const command = process.platform === "win32" ? "rundll32.exe" : process.platform === "darwin" ? "open" : "xdg-open";
  const args = process.platform === "win32" ? ["url.dll,FileProtocolHandler", url] : [url];
  return await new Promise((resolve4) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve4(value);
    };
    try {
      const child = spawn(command, args, { detached: true, stdio: "ignore", windowsHide: true });
      child.once("error", () => finish(false));
      child.once("spawn", () => {
        child.unref();
        finish(true);
      });
    } catch {
      finish(false);
    }
  });
}
async function handleOpenPage(host, request) {
  if (request.method !== "POST") return json2(405, { ok: false, error: "method-not-allowed" });
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json2(415, { ok: false, error: "unsupported-media-type" });
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_OPEN_PAGE_BYTES + 64 * 1024) {
    return json2(413, { ok: false, error: "too-large" });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json2(400, { ok: false, error: "invalid-json" });
  }
  if (typeof body !== "object" || body === null) return json2(400, { ok: false, error: "invalid-request" });
  try {
    if (body.mode === "page") {
      if (typeof body.html !== "string" || typeof body.title !== "string") {
        return json2(400, { ok: false, error: "invalid-page" });
      }
      const frameAncestor = request.headers.get("origin") ?? void 0;
      const published = await host.publish(body.html, body.title, frameAncestor);
      return json2(200, { ok: true, mode: "page", ...published });
    }
    if (body.mode === "system") {
      if (typeof body.token !== "string") return json2(400, { ok: false, error: "invalid-token" });
      const opened = await host.openSystem(body.token);
      return json2(200, { ok: true, mode: "system", opened });
    }
    return json2(400, { ok: false, error: "unknown-mode" });
  } catch (error) {
    return json2(500, {
      ok: false,
      error: "publish-failed",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

// src/self-repair.ts
import { createHash as createHash3, randomUUID } from "node:crypto";
var SELF_REPAIR_PLUGIN = "@nagi-ovo/dsh-visualize";
var SELF_REPAIR_SOURCE_KIND = `plugin:${SELF_REPAIR_PLUGIN}`;
var MAX_STEERS_PER_TURN = 2;
var MIN_FENCE_LINES = 8;
var BREAKING_WARNINGS = /* @__PURE__ */ new Set(["VZ102", "VZ106", "VZ107"]);
var FILE_TOOLS = /* @__PURE__ */ new Set(["write", "edit", "multi_edit", "apply_patch", "write_file", "edit_file", "create_file", "notebook_edit"]);
var MAX_TRACKED_TURNS = 256;
function emptyTurnFacts() {
  return {
    userText: "",
    finalText: "",
    finalInterrupted: false,
    textAfterVisualize: "",
    visualizeCalled: false,
    fileToolCalled: false,
    lastVisualize: void 0,
    cards: /* @__PURE__ */ new Map()
  };
}
function planRepairs(facts) {
  const plans = [];
  const last = facts.lastVisualize;
  if (last !== void 0 && !last.ok && isOwnRejection(last.text) && !admitsFailure(facts.textAfterVisualize)) {
    plans.push({
      kind: "failed-call",
      fingerprint: fingerprint2("failed-call", last.text),
      text: `${TAG} Your last visualize call failed, so nothing rendered and the user sees no card. Apply the fixes that error listed and call visualize again now. If the card cannot be made to pass, tell the user in one sentence what blocks it instead.`
    });
  }
  for (const [path, card] of facts.cards) {
    const findings = breakingFindings(card.fragment);
    if (findings.length === 0) continue;
    plans.push({
      kind: "card-warnings",
      fingerprint: fingerprint2("card-warnings", path, ...findings.map((f) => `${f.code}@${f.offset}:${f.excerpt}`)),
      text: `${TAG} The card "${card.title}" rendered, but these findings leave it broken:
${formatFindings(findings)}
Patch it now: visualize with action "update", path "${path}", its title restated. Then end your reply; do not mention this check.`
    });
  }
  if (facts.visualizeCalled || facts.fileToolCalled || facts.finalInterrupted || asksForCode(facts.userText)) return plans;
  const fence = wantsVisual(facts.userText) ? cardShapedFence(facts.finalText) : void 0;
  if (fence !== void 0) {
    plans.push({
      kind: "pasted-markup",
      fingerprint: fingerprint2("pasted-markup", fence),
      text: `${TAG} Your reply pastes HTML/SVG markup as a code block, so the user sees source code, not a rendered card. Call visualize now with that markup as \`fragment\` (a fragment only; load the visualize skill first if you have not), then add one or two sentences and do not paste the markup again. If the user wanted the code itself, end your turn with one short line instead.`
    });
  }
  const promise = fence === void 0 ? promisedCard(facts.finalText) : void 0;
  if (promise !== void 0) {
    plans.push({
      kind: "promised-card",
      fingerprint: fingerprint2("promised-card", promise),
      text: `${TAG} You said you would show a card, but the turn is ending without a visualize call. Call visualize now. If you decided against a card, end your turn with one short line.`
    });
  }
  return plans;
}
var TAG = "[dsh-visualize]";
function isOwnRejection(text) {
  return /^(?:Error:\s*)?invalid visualization/u.test(text.trimStart()) && !/\bSTOP:/u.test(text);
}
function admitsFailure(text) {
  return /\b(?:fail(?:s|ed|ing|ure)?|errors?|couldn't|could not|can't|cannot|unable|blocked|didn't render|did not render|not render)\b/iu.test(text) || /失败|错误|报错|无法|没能|未能|不能|渲染不了|没有渲染|没渲染/u.test(text);
}
function breakingFindings(fragment) {
  try {
    return lintFragment(fragment, Number.MAX_SAFE_INTEGER).findings.filter((f) => f.severity === "warn" && BREAKING_WARNINGS.has(f.code));
  } catch {
    return [];
  }
}
function asksForCode(text) {
  return /\b(?:html?|css|svg|xml|js|javascript|typescript|jsx|tsx|react|vue|svelte|angular|tailwind|code|snippets?|source|markup|files?|template|components?|website|web ?page|landing page|front-?end|embed|copy|paste|download|save|export)\b/iu.test(text) || /代码|源码|源文件|文件|模板|组件|网页|网站|前端|落地页|片段|嵌入|复制|粘贴|下载|保存|导出|页面|标签/u.test(text) || /```|<\/?[a-z][\w-]*[\s/>]/iu.test(text);
}
function wantsVisual(text) {
  return /visuali[sz]|\bchart|\bplot|\bgraph|diagram|\bdraw|sketch|animat|simulat|interactive|illustrat|\bdemo|show me|dashboard|explorable/iu.test(text) || /可视化|画|图|演示|动画|模拟|交互|直观|展示|卡片/u.test(text);
}
function cardShapedFence(text) {
  let found;
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const open3 = /^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)[^\n`]*$/u.exec(lines[i]);
    if (open3 === null) continue;
    const marker = open3[1];
    const closeAt = lines.findIndex((line, j) => j > i && new RegExp(`^ {0,3}${marker[0] === "`" ? "`" : "~"}{${marker.length},}[ \\t]*$`, "u").test(line));
    if (closeAt === -1) break;
    const body = lines.slice(i + 1, closeAt).join("\n");
    if (/^(?:html?|svg)$/iu.test(open3[2]) && isCardShaped(body)) found = body;
    i = closeAt;
  }
  return found;
}
function isCardShaped(body) {
  if (/<!doctype|<html[\s>]|<head[\s>]|<body[\s>]/iu.test(body)) return false;
  if (body.split("\n").filter((line) => line.trim().length > 0).length < MIN_FENCE_LINES) return false;
  return /<(?:script|svg|canvas)[\s>]/iu.test(body);
}
var PROMISE_EN = /\b(?:I(?:'ll| will| am going to|'m going to)|let me|let's)\s+(?:now\s+|also\s+|quickly\s+|first\s+)?(?:(?:draw|render|build|create|make|show|put together|sketch)\b[^.!?\n]{0,80}?\b(?:card|visuali[sz]ation|interactive (?:chart|demo|diagram|simulation|widget|explorer))\b|visuali[sz]e\b)[^.!?\n]{0,60}[.:!…]*$/iu;
var PROMISE_ZH = /(?:我|下面|接下来|现在|让我)(?:来|将|会|现在|先|再|就)*(?:为你|给你|帮你)?(?:画|绘制|做|生成|渲染|制作|画出|展示|可视化)[^。！？?!\n]{0,30}?(?:卡片|可视化|交互式?(?:图|演示|动画|模拟|图表))?[^。！？?!\n]{0,20}[。：:…]*$/u;
var CONDITIONAL = /\b(?:if|would|could|can|should|want|like|whether|maybe|perhaps)\b|如果|的话|要不要|是否|可以|需要吗|想要|吗/iu;
function promisedCard(text) {
  const trimmed = text.trim();
  if (trimmed.length === 0) return void 0;
  const sentence = /[^.!?。！？\n]*[.!?。！？:：…]*\s*$/u.exec(trimmed)?.[0]?.trim() ?? "";
  if (sentence.length === 0 || /[?？]$/u.test(sentence) || CONDITIONAL.test(sentence)) return void 0;
  if (PROMISE_EN.test(sentence)) return sentence;
  if (PROMISE_ZH.test(sentence) && /卡片|可视化|交互/u.test(sentence)) return sentence;
  return void 0;
}
function fingerprint2(...parts) {
  return createHash3("sha256").update(parts.join("\0")).digest("hex").slice(0, 16);
}
function textOf(content) {
  if (!Array.isArray(content)) return "";
  return content.map((block) => typeof block === "object" && block !== null && block.type === "text" ? String(block.text ?? "") : "").filter((part) => part.length > 0).join("\n");
}
function observedResult(data) {
  const record = data ?? {};
  const message = record.message ?? {};
  const source = message["source"];
  const content = message["content"];
  const block = Array.isArray(content) && content.length === 1 && content[0]?.type === "tool-result" ? content[0] : void 0;
  const callId = [message["toolCallId"], source?.callId, block?.toolCallId].find((v) => typeof v === "string");
  return {
    callId,
    isError: message["isError"] === true || block?.isError === true || record.error !== void 0,
    text: textOf(block?.content ?? content),
    meta: record.meta
  };
}
function sessionKey(session) {
  const id = session?.id ?? session?.header?.id;
  return id === void 0 ? void 0 : String(id);
}
function correctionMessage(text, formatVersion) {
  const summary = "visualize self-repair requested";
  const source = typeof formatVersion === "number" && formatVersion >= 4 ? { kind: SELF_REPAIR_SOURCE_KIND, form: "notice", summary } : { kind: "plugin", plugin: SELF_REPAIR_PLUGIN, form: "notice", summary };
  const content = Object.freeze([Object.freeze({ type: "text", text })]);
  return Object.freeze({ id: randomUUID(), role: "user", content, source: Object.freeze(source) });
}
function installSelfRepair(ctx) {
  const turns = /* @__PURE__ */ new Map();
  const events = ctx;
  const logger = ctx.logger;
  events.on("session/event", (session, event) => {
    try {
      observe(turns, session, event);
    } catch (error) {
      logger?.warn?.(`dsh-visualize: self-repair observer failed (${error instanceof Error ? error.message : String(error)})`);
    }
  });
  events.on("agent/turn-stopping", ({ agent, turn, signal }) => {
    if (signal?.aborted === true || typeof agent?.steer !== "function") return;
    const key = sessionKey(agent.session);
    const state = key === void 0 ? void 0 : turns.get(key);
    if (state === void 0 || state.turn !== turn || state.subagent) return;
    if (state.steers >= MAX_STEERS_PER_TURN) return;
    const plan = planRepairs(state.facts).find((p) => !state.fingerprints.has(p.fingerprint));
    if (plan === void 0) return;
    state.fingerprints.add(plan.fingerprint);
    state.steers += 1;
    try {
      agent.steer(correctionMessage(plan.text, agent.session?.header?.version));
    } catch (error) {
      logger?.warn?.(`dsh-visualize: self-repair steer failed (${error instanceof Error ? error.message : String(error)})`);
    }
  });
}
function observe(turns, session, event) {
  const key = sessionKey(session);
  if (key === void 0) return;
  const data = event.data;
  if (event.type === "turn/start") {
    turns.delete(key);
    turns.set(key, {
      turn: Number(data?.["turn"]),
      subagent: session.header?.origin === "subagent",
      facts: emptyTurnFacts(),
      calls: /* @__PURE__ */ new Map(),
      steers: 0,
      fingerprints: /* @__PURE__ */ new Set()
    });
    if (turns.size > MAX_TRACKED_TURNS) {
      const oldest = turns.keys().next().value;
      if (oldest !== void 0) turns.delete(oldest);
    }
    return;
  }
  if (event.type === "turn/end") {
    turns.delete(key);
    return;
  }
  const state = turns.get(key);
  if (state === void 0 || data === void 0) return;
  const facts = state.facts;
  switch (event.type) {
    case "user/message": {
      if (data["source"]?.kind !== "user") return;
      facts.userText += `${textOf(data["content"])}
`;
      return;
    }
    case "assistant/message": {
      const text = textOf(data["message"]?.content);
      facts.finalText = text;
      facts.finalInterrupted = data["interrupted"] === true;
      if (text.length > 0) facts.textAfterVisualize += `${text}
`;
      return;
    }
    case "tool/call": {
      const name2 = data["name"];
      const callId = data["callId"];
      if (typeof name2 !== "string") return;
      if (typeof callId === "string") state.calls.set(callId, name2);
      if (name2 === VISUALIZE_TOOL_NAME) facts.visualizeCalled = true;
      if (FILE_TOOLS.has(name2)) facts.fileToolCalled = true;
      return;
    }
    case "tool/result": {
      const result = observedResult(data);
      if (result.callId === void 0 || state.calls.get(result.callId) !== VISUALIZE_TOOL_NAME) return;
      facts.textAfterVisualize = "";
      if (result.isError) {
        facts.lastVisualize = { ok: false, text: result.text };
        return;
      }
      facts.lastVisualize = { ok: true };
      const meta = visualizeMetaFrom(result.meta);
      if (meta === void 0) return;
      facts.cards.delete(meta.path);
      facts.cards.set(meta.path, { title: meta.title, fragment: meta.fragment });
      return;
    }
    default:
      return;
  }
}

// src/index.ts
var name = "dsh-visualize";
var inject = ["tools", "skills", "fs"];
var Config = z2.object({
  maxFragmentBytes: z2.natural().default(1e6),
  style: styleFieldSchema(),
  selfRepair: z2.boolean().default(true).description("Same-turn self-repair \xB7 \u540C\u56DE\u5408\u81EA\u6211\u4FEE\u590D"),
  cardRetentionDays: z2.natural().max(3650).default(90)
});
function apply(ctx, config) {
  const style = () => readStyle(config.style);
  const imageRoute = registerImageRoute(ctx);
  const images = { delivery: () => imageRoute.ready };
  let toolStyle = style();
  let disposeTool = ctx.tools.register(visualizeTool(ctx, config.maxFragmentBytes, style, images));
  const events = ctx;
  events.on("loader/volatile-update", () => {
    if (style() === toolStyle) return;
    disposeTool();
    toolStyle = style();
    disposeTool = ctx.tools.register(visualizeTool(ctx, config.maxFragmentBytes, style, images));
  });
  ctx.skills.registerProvider(() => visualizeSkillProvider(style, (cwd) => styleFileLocations(ctx, cwd)));
  injectPageConfig(ctx, style);
  registerStyleFiles(ctx);
  const openPages = createOpenPageHost();
  ctx.effect(() => () => openPages.dispose(), "dsh-visualize: open page host");
  registerOpenPage(ctx, openPages);
  declineGeneratedSettingsPage(ctx);
  if (config.selfRepair !== false) installSelfRepair(ctx);
  scheduleCardRetention(ctx, config.cardRetentionDays);
}
function scheduleCardRetention(ctx, days) {
  if (!Number.isSafeInteger(days) || days <= 0) return;
  const root = storeRoot(ctx);
  if (root === void 0) return;
  const logger = ctx.logger("dsh-visualize");
  const run = () => {
    void pruneExpiredSessions(root, { retentionDays: days }).then((result) => {
      if (result.pruned.length > 0) {
        logger.info("card retention: removed %d expired session(s), %d file(s)", result.pruned.length, result.removedFiles);
      }
    }).catch((error) => {
      logger.warn("card retention skipped: %s", error instanceof Error ? error.message : String(error));
    });
  };
  ctx.effect(() => {
    const initial = setTimeout(run, 15e3);
    initial.unref();
    const timer = setInterval(run, DAY_MS);
    timer.unref();
    return () => {
      clearTimeout(initial);
      clearInterval(timer);
    };
  }, "dsh-visualize: card retention");
}
function registerOpenPage(ctx, host) {
  ctx.inject(["connection"], (scope) => {
    const fetch = scope.get("connection")?.fetch;
    if (typeof fetch?.register !== "function") return;
    const register = fetch.register.bind(fetch);
    scope.effect(() => register({
      path: OPEN_PAGE_PATH,
      methods: ["POST"],
      requestBody: "buffered",
      fetch: async (request) => await handleOpenPage(host, request)
    }), "dsh-visualize: open page route");
  });
}
function injectPageConfig(ctx, style) {
  const events = ctx;
  events.on("webserver/index-inject", (table) => {
    table.push({ kind: "global", name: PAGE_CONFIG_GLOBAL, value: { style: style() } });
  });
}
function registerStyleFiles(ctx) {
  const host = styleFilesHost(ctx);
  ctx.inject(["connection"], (scope) => {
    const fetch = scope.get("connection")?.fetch;
    if (typeof fetch?.register !== "function") return;
    const register = fetch.register.bind(fetch);
    scope.effect(() => register({
      path: STYLE_FILES_PATH,
      methods: ["GET", "POST"],
      requestBody: "buffered",
      fetch: async (request) => await handleStyleFiles(host, request)
    }), "dsh-visualize: style files route");
  });
}
function registerImageRoute(ctx) {
  const state = { ready: false };
  ctx.inject(["connection"], (scope) => {
    const fetch = scope.get("connection")?.fetch;
    if (typeof fetch?.register !== "function") return;
    const register = fetch.register.bind(fetch);
    scope.effect(() => {
      const dispose = register({
        path: IMAGE_ROUTE_PATH,
        methods: ["GET", "HEAD"],
        requestBody: "buffered",
        fetch: async (request) => await handleImageRequest(storeRoot(ctx), request)
      });
      state.ready = true;
      return () => {
        state.ready = false;
        return dispose();
      };
    }, "dsh-visualize: card images route");
  });
  return state;
}
function declineGeneratedSettingsPage(ctx) {
  ctx.inject(["settings"], (scope) => {
    const settings = scope.get("settings");
    if (typeof settings?.configure !== "function") return;
    const configure = settings.configure.bind(settings);
    scope.effect(() => configure({ auto: false }, ctx.fiber), "dsh-visualize: settings page policy");
  });
}
export {
  Config,
  STYLE_FILES_PATH,
  STYLE_IDS,
  VISUALIZE_TOOL_NAME,
  apply,
  inject,
  name,
  readStyle,
  validateFragment,
  visualizeMetaFrom
};
