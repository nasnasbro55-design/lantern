// Owner: Naz. Signs each hour's sensor readings with Kevin's ledger and verifies the hash chain at the end.
// Fully isolated: any crypto failure just yields an empty summary and never touches the game.
import { append, verify, type Entry } from '../sim/ledger';
import type { WorldState } from '../sim';

let log: Entry[] = [], last = -1, queue: Promise<unknown> = Promise.resolve();

export function record(w: WorldState): void {
  if (w.tick === last) return;
  last = w.tick;
  const readings = w.levels.filter(l => l.sensed).map(l => ({ level: l.level, ...l.truth }));
  if (readings.length) queue = queue.then(async () => { log = await append(log, JSON.stringify({ tick: w.tick, readings })); }).catch(() => {});
}

export async function summary(): Promise<string> {
  try { await queue; return log.length ? `${log.length} signed sensor readings, hash chain ${await verify(log) ? 'verified' : 'BROKEN'}.` : ''; } catch { return ''; }
}
