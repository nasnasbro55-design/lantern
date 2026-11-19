// Owner: Naz. Scripted disaster timeline; holds truth vs official values per level.
import type { Alert, Kind, Sim, WorldState } from './types';

export const LEVELS = 12, TICKS = 48, CUT = 18, ALLOC = 24, SURFACE = 40, DARK = 25, POINTS = 26;
export const COST = { sensor: 2, relay: 1, shaft: 2 };
const KINDS: Kind[] = ['voltage', 'temp', 'water', 'cough'];
const DANGER: Record<Kind, number> = { voltage: 45, temp: 38, water: 40, cough: 20 };
const DOWN: Record<Kind, boolean> = { voltage: true, temp: false, water: true, cough: false };
const rng = (s: number) => () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

export function createSim(): Sim {
  let w: WorldState, rand = rng(1), hist: number[][][] = [], link = 0;
  const base = (): WorldState => ({
    tick: 0, netUp: true, supply: 100, points: POINTS, rule: null, surface: false, outcome: 'playing', note: 'Build sensors to see the truth.', alerts: [], checkins: [],
    nodes: [{ type: 'relay', level: 1, x: 5, link: -1 }],
    levels: Array.from({ length: LEVELS }, (_, i) => ({ level: i + 1, sensed: false, powered: true, truth: { voltage: 100, temp: 24, water: 95, cough: 4 }, official: { voltage: 98, temp: 24, water: 94, cough: 4 } })),
  });
  /** Hops from a level's mesh points to the level 1 hub, or -1 when there is no path. */
  const path = (level: number): number => {
    const d = new Map<number, number>(), q = w.nodes.map((n, i) => [n, i] as const).filter(([n]) => n.level === level).map(([, i]) => i);
    q.forEach(i => d.set(i, 0));
    for (let h = 0; h < q.length; h++) {
      const a = w.nodes[q[h]];
      if (a.level === 1 && a.link === -1) return d.get(q[h])!;
      w.nodes.forEach((b, j) => { if (!d.has(j) && ((b.level === a.level && Math.abs(b.x - a.x) <= 4) || (b.link === a.link && a.link >= 0))) { d.set(j, d.get(q[h])! + 1); q.push(j); } });
    }
    return -1;
  };
  const alerts = (): Alert[] => w.levels.filter(l => l.sensed).flatMap(l => KINDS.flatMap(k => {
    const h = hist[l.level - 1][KINDS.indexOf(k)], s = DOWN[k] ? -1 : 1, v = h[h.length - 1] * s, slope = (h[h.length - 1] - h[0]) * s / Math.max(1, h.length - 1);
    if (v >= DANGER[k] * s) return [{ level: l.level, kind: k, eta: 0, severity: 'critical' as const }];
    const eta = slope > 0.05 ? Math.ceil((DANGER[k] * s - v) / slope) : Infinity;
    return eta <= 24 ? [{ level: l.level, kind: k, eta, severity: eta <= 6 ? 'critical' as const : eta <= 12 ? 'high' as const : 'watch' as const }] : [];
  })).sort((a, b) => a.eta - b.eta);

  return {
    reset(seed) { rand = rng(seed); link = 0; w = base(); hist = w.levels.map(l => KINDS.map(k => [l.truth[k]])); return w; },
    act(a) {
      if (!w) this.reset(1);
      if (w.outcome !== 'playing') return w;
      if (a.type === 'alloc') { if (w.rule === null) { w.rule = a.x ? 'fair' : 'directorate'; w.note = a.x ? 'Fair share: the hardest hit levels get the most.' : 'Directorate rule: upper levels first.'; } return w; }
      const cost = COST[a.type], lv = w.levels[a.level - 1];
      if (!lv || a.x < 0 || a.x > 9) return w;
      if (w.points < cost) { w.note = `Not enough build points (need ${cost}).`; return w; }
      if (a.type === 'sensor') { if (lv.sensed) { w.note = 'Already sensed.'; return w; } lv.sensed = true; w.note = `Sensor live on level ${a.level}.`; }
      else if (w.nodes.some(n => n.type === a.type && n.level === a.level && n.x === a.x && (n.link < 0 || w.nodes.find(m => m.link === n.link) === n))) { w.note = 'Already built here.'; return w; }
      else { link++; w.nodes.push({ type: a.type, level: a.level, x: a.x, link }); for (let up = 1; up <= 2 && a.type === 'shaft' && a.level - up >= 1; up++) w.nodes.push({ type: 'shaft', level: a.level - up, x: a.x, link }); if (a.type === 'shaft' && a.level === 1) w.surface = true; w.note = `${a.type} built on level ${a.level}.`; }
      w.points -= cost; w.alerts = alerts();
      return w;
    },
    step() {
      if (!w) this.reset(1);
      if (w.outcome !== 'playing') return w;
      const t = ++w.tick, was = w.levels.map(l => l.powered);
      if (t === CUT) { w.netUp = false; w.note = 'The Directorate has cut the network.'; }
      w.levels.forEach((l, i) => {
        const d = (l.level - 1) / 11, rl = t >= ALLOC ? (w.rule ?? 'directorate') : null;
        const m = rl === 'fair' ? (l.level >= 9 ? 0.35 : 1.2) : rl === 'directorate' ? (l.level <= 4 ? 0.3 : l.level >= 9 ? 1.5 : 1) : 1;
        if (t >= 30 - 20 * d) l.truth.voltage = Math.max(0, l.truth.voltage - (1.6 + 1.2 * d) * m);
        l.truth.temp = 24 + Math.max(0, t - 14) * (0.25 + 0.45 * d);
        l.truth.water = Math.max(0, 95 - Math.max(0, t - (6 + 24 * (1 - d))) * (1 + 1.8 * d));
        l.truth.cough = 4 + Math.max(0, 90 - l.truth.water) * 0.25 + Math.max(0, l.truth.temp - 30) * 0.6;
        l.official = { voltage: 98 + ((t + l.level) % 3) - 1, temp: 24, water: 94 + ((t + l.level) % 2), cough: 4 + ((t + l.level) % 2) };
        l.powered = l.truth.voltage > DARK;
        KINDS.forEach((k, j) => { hist[i][j].push(l.truth[k]); if (hist[i][j].length > 5) hist[i][j].shift(); });
      });
      w.supply = Math.max(0, 100 - t * 1.2);
      w.checkins = !w.netUp ? w.levels.filter(l => path(l.level) >= 0).map(l => ({ level: l.level, ok: rand() < Math.pow(0.9, path(l.level)) })) : [];
      const dark = w.levels.find((l, i) => was[i] && !l.powered && !l.sensed && w.netUp === false && path(l.level) < 0);
      if (dark) { w.outcome = 'lost'; w.note = `Level ${dark.level} went dark with no warning and no mesh path.`; }
      else if (t >= TICKS) {
        const deep = w.levels.filter(l => l.level >= 9).every(l => l.powered);
        w.outcome = deep && w.surface ? 'won' : 'lost';
        w.note = !deep ? 'The deep levels went dark.' : !w.surface ? 'The surface was never confirmed. Build a shaft on level 1.' : 'The deep levels survived and the surface is confirmed.';
      }
      w.alerts = alerts();
      return w;
    },
  };
}
