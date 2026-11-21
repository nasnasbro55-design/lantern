export interface MeshNode { id: number; level: number; x: number; kind: 'relay' | 'shaft' }

/** One delivery attempt. Use a different seed to simulate retrying failed links. */
export function canReach(nodes: MeshNode[], fromLevel: number, toLevel: number, seed = 1): boolean {
  const queue = nodes.filter(node => node.level === fromLevel);
  const visited = new Set(queue.map(node => node.id));
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    if (current.level === toLevel) return true;
    for (const next of nodes) {
      if (visited.has(next.id)) continue;
      const nearby = current.level === next.level && Math.abs(current.x - next.x) <= 4;
      const shaft = current.kind === 'shaft' && next.kind === 'shaft'
        && Math.abs(current.level - next.level) === 1 && current.x === next.x;
      if ((nearby || shaft) && linkWorks(current.id, next.id, seed)) {
        visited.add(next.id);
        queue.push(next);
      }
    }
  }
  return false;
}

function linkWorks(first: number, second: number, seed: number): boolean {
  // Give each undirected link a stable result, regardless of traversal order.
  let hash = Math.imul(Math.min(first, second), 0x9e3779b1)
    ^ Math.imul(Math.max(first, second), 0x85ebca6b) ^ seed;
  hash = Math.imul(hash ^ (hash >>> 16), 0x7feb352d);
  hash = Math.imul(hash ^ (hash >>> 15), 0x846ca68b);
  return ((hash ^ (hash >>> 16)) >>> 0) / 2 ** 32 < 0.9;
}
