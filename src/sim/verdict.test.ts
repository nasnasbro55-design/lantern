import { expect, it } from 'vitest';
import { surfaceVerdict } from './verdict';

it('counts each cluster once and rejects an extreme cluster', () => {
  const flood = Array.from({ length: 100 }, () => ({ cluster: 'outlier', value: 999 }));
  expect(surfaceVerdict([
    { cluster: 'a', value: 10 }, { cluster: 'b', value: 11 }, { cluster: 'c', value: 12 }, ...flood,
  ])).toBe(11);
});

it('handles empty input and finds the median within one cluster', () => {
  expect(surfaceVerdict([])).toBeNull();
  expect(surfaceVerdict([{ cluster: 'a', value: 2 }, { cluster: 'a', value: 4 }])).toBe(3);
});
