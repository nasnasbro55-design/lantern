import type { Alert, Kind } from './types';

/** Forecast from the five most recent hourly readings. */
export function forecast(level: number, kind: Kind, history: number[], danger: number): Alert | null {
  const direction = kind === 'water' || kind === 'voltage' ? -1 : 1;
  const readings = history.slice(-5).map(value => direction * value);
  if (!readings.length || !readings.every(Number.isFinite) || !Number.isFinite(danger)) return null;
  const remaining = danger * direction - readings[readings.length - 1];

  const midpoint = (readings.length - 1) / 2;
  let covariance = 0;
  let variance = 0;
  readings.forEach((value, index) => {
    const offset = index - midpoint;
    covariance += offset * value;
    variance += offset ** 2;
  });
  const slope = covariance / variance;
  const eta = remaining <= 0 ? 0 : slope > 0 ? Math.ceil(remaining / slope) : Infinity;
  if (eta > 24) return null;
  return { level, kind, eta, severity: eta <= 6 ? 'critical' : eta <= 12 ? 'high' : 'watch' };
}
