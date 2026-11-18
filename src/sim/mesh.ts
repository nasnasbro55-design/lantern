// Owner: Kevin. Store-and-forward mesh between nearby nodes; shaft nodes link levels; each handoff can fail.
export interface MeshNode { id: number; level: number; x: number; kind: 'relay' | 'shaft' }

/** True when a check-in message can hop from one level to another through the built nodes. */
export function canReach(nodes: MeshNode[], fromLevel: number, toLevel: number): boolean {
  // TODO: breadth-first search over nodes within range, with a seeded chance of each hop failing
  void nodes; void fromLevel; void toLevel;
  return false;
}
