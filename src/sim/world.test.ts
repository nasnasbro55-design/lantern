// Owner: Naz.
import { describe, expect, it } from 'vitest';
import { ALLOC, COST, POINTS, TICKS, createSim } from './world';

const run = (rule: 'directorate' | 'fair', sensors: number[], exit = true) => {
  const s = createSim(); s.reset(7);
  sensors.forEach(l => s.act({ type: 'sensor', level: l, x: 4 }));
  if (exit) s.act({ type: 'shaft', level: 1, x: 8 });
  let w = s.act({ type: 'relay', level: 1, x: 1 });
  for (let i = 0; i < TICKS && w.outcome === 'playing'; i++) { if (i === ALLOC - 1) s.act({ type: 'alloc', level: 0, x: rule === 'fair' ? 1 : 0 }); w = s.step(); }
  return w;
};

describe('world', () => {
  it('is deterministic for a seed', () => {
    const a = createSim(), b = createSim(); a.reset(3); b.reset(3);
    for (let i = 0; i < 30; i++) { a.step(); b.step(); }
    expect(JSON.stringify(a.step())).toBe(JSON.stringify(b.step()));
  });
  it('shows official numbers that disagree with the truth once the disaster runs', () => {
    const s = createSim(); s.reset(1); let w = s.step();
    for (let i = 0; i < 34; i++) w = s.step();
    const deep = w.levels[11];
    expect(deep.official.water).toBeGreaterThan(90);
    expect(deep.truth.water).toBeLessThan(40);
  });
  it('charges build points and refuses when broke', () => {
    const s = createSim(); const w = s.reset(1);
    s.act({ type: 'sensor', level: 12, x: 2 });
    expect(w.points).toBe(POINTS - COST.sensor);
    for (let l = 1; l <= 12; l++) s.act({ type: 'sensor', level: l, x: 0 });
    expect(w.points).toBeGreaterThanOrEqual(0);
  });
  it('only warns about levels that have a sensor', () => {
    const s = createSim(); s.reset(1); let w = s.step();
    for (let i = 0; i < 25; i++) w = s.step();
    expect(w.alerts).toHaveLength(0);
    w = s.act({ type: 'sensor', level: 12, x: 3 });
    expect(w.alerts.every(a => a.level === 12)).toBe(true);
    expect(w.alerts.length).toBeGreaterThan(0);
  });
  it('can be won with fair share, a surface exit and sensors on the mid levels', () => {
    expect(run('fair', [6, 7, 8]).outcome).toBe('won');
  });
  it('loses when the Directorate rule starves the deep levels', () => {
    expect(run('directorate', [6, 7, 8]).outcome).toBe('lost');
  });
  it('loses when a mid level goes dark unseen and unconnected', () => {
    expect(run('fair', []).outcome).toBe('lost');
  });
  it('sends check-ins from level 12 once shafts on every second level link it to the hub', () => {
    const s = createSim(); s.reset(7);
    [12, 10, 8, 6, 4, 2].forEach(l => s.act({ type: 'shaft', level: l, x: 4 }));
    let w = s.act({ type: 'relay', level: 1, x: 1 }), seen = false;
    for (let i = 0; i < 30; i++) { w = s.step(); seen ||= w.checkins.some(c => c.level === 12); }
    expect(seen).toBe(true);
  });
  it('rejects the flooded probe cluster and reports a safe surface once the exit is built', () => {
    const w = run('fair', [6, 7, 8]);
    expect(w.verdict).not.toBeNull();
    expect(w.verdict!).toBeGreaterThan(19);
    expect(w.verdict!).toBeLessThan(20);
  });
  it('cannot be won without confirming the surface', () => {
    expect(run('fair', [6, 7, 8], false).outcome).toBe('lost');
  });
});
