import { expect, it } from 'vitest';
import { canReach, type MeshNode } from './mesh';

const nodes: MeshNode[] = [
  { id: 1, level: 1, x: 0, kind: 'relay' },
  { id: 2, level: 1, x: 3, kind: 'shaft' },
  { id: 3, level: 2, x: 3, kind: 'shaft' },
  { id: 4, level: 3, x: 3, kind: 'relay' },
];

it('crosses an aligned shaft but cannot cross to a relay on another level', () => {
  expect(canReach(nodes, 1, 2, 1)).toBe(true);
  expect(canReach(nodes, 1, 3, 1)).toBe(false);
  expect(canReach(nodes.filter(node => node.id !== 2), 1, 2, 1)).toBe(false);
});

it('allows seeded failures with stable results in either direction', () => {
  const attempts = Array.from({ length: 100 }, (_, seed) => {
    const delivered = canReach(nodes, 1, 2, seed);
    expect(canReach(nodes, 2, 1, seed)).toBe(delivered);
    return delivered;
  });
  expect(attempts).toContain(false);
  expect(attempts).toContain(true);
});
