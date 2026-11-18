// Owner: Naz. Scripted disaster timeline; holds truth vs official values per level.
import type { Sim, WorldState } from './types';

export function createSim(): Sim {
  // TODO: reset(seed), step(), act(action) returning the new WorldState
  const empty: WorldState = { tick: 0, levels: [], alerts: [], netUp: true, supply: 0 };
  return { reset: () => empty, step: () => empty, act: () => empty };
}
