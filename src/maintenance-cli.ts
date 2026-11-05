/** Explicit local maintenance; no mutation without a fresh inventory confirmation. */
import { cleanupCardStoreTemps } from './storage-maintenance.ts'
const args = process.argv.slice(2)
const allowed = new Set(['--root', '--confirm', '--include-stale-locks', '--min-age-hours'])
function option(name: string): string | undefined {
  const at = args.indexOf(name)
  if (at < 0) return undefined
  const value = args[at + 1]
  if (value === undefined || value.startsWith('--')) throw new Error(name + ' requires a value')
  return value
}
async function main(): Promise<void> {
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i]!
    if (!allowed.has(key)) throw new Error('Unknown option: ' + key)
    if (key !== '--include-stale-locks') i += 1
  }
  const root = option('--root')
  if (root === undefined) throw new Error('Pass --root with the explicit absolute visualize store path; default is dry-run')
  const confirm = option('--confirm')
  if (confirm !== undefined && !/^[a-f0-9]{64}$/u.test(confirm)) throw new Error('Invalid confirmation token; run dry-run first')
  const hoursRaw = option('--min-age-hours')
  const minTempAgeMs = hoursRaw === undefined ? undefined : Number(hoursRaw) * 60 * 60 * 1000
  if (minTempAgeMs !== undefined && (!Number.isSafeInteger(minTempAgeMs) || minTempAgeMs < 60 * 60 * 1000)) throw new Error('Minimum age must be at least one hour')
  const result = await cleanupCardStoreTemps(root, {
    ...confirm === undefined ? {} : { confirm },
    ...minTempAgeMs === undefined ? {} : { minTempAgeMs },
    includeStaleLocks: args.includes('--include-stale-locks'),
  })
  const counts: Record<string, number> = {}
  for (const entry of result.inventory.entries) counts[entry.kind] = (counts[entry.kind] ?? 0) + 1
  console.log(JSON.stringify({status: result.status, root:result.inventory.root, complete:result.inventory.complete,
    preservedHistoricalCards:true, counts, candidates:result.inventory.entries.filter(entry => entry.cleanupEligible),
    confirmationToken:result.inventory.confirmationToken, removed:result.removed, ...result.error ? {error:result.error}: {},
  }, null, 2))
  if (result.status === 'partial') process.exitCode = 1
}
main().catch(error => { console.error('visualize maintenance: ' + String(error)); process.exitCode = 1 })
