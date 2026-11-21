import { expect, it } from 'vitest';
import { append, verify } from './ledger';

it('signs a chain without modifying the previous version', async () => {
  const first = await append([], 'level 12: water 34');
  const second = await append(first, 'level 12: water 32');
  expect(first).toHaveLength(1);
  expect(second[1].prevHash).toBe(first[0].hash);
  expect(await verify(second)).toBe(true);
});

it('detects edited readings, invalid signatures and removed predecessors', async () => {
  const log = await append(await append([], 'first'), 'second');
  expect(await verify([{ ...log[0], payload: 'edited' }, log[1]])).toBe(false);
  expect(await verify([{ ...log[0], signature: '00'.repeat(64) }, log[1]])).toBe(false);
  expect(await verify(log.slice(1))).toBe(false);
});
