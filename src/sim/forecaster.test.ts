import { expect, it } from 'vitest';
import { forecast } from './forecaster';

it('projects falling water quality and rising temperature', () => {
  expect(forecast(12, 'water', [80, 70, 60], 40)).toEqual({
    level: 12, kind: 'water', eta: 2, severity: 'critical',
  });
  expect(forecast(9, 'temp', [25, 26, 27], 38)?.eta).toBe(11);
});

it('reports present danger and ignores receding or distant danger', () => {
  expect(forecast(12, 'voltage', [45], 45)?.eta).toBe(0);
  expect(forecast(12, 'water', [60, 70], 40)).toBeNull();
  expect(forecast(12, 'cough', [1, 2], 30)).toBeNull();
});
