export interface Probe { cluster: string; value: number }

export function surfaceVerdict(probes: Probe[]): number | null {
  const clusters = new Map<string, number[]>();
  for (const { cluster, value } of probes) {
    if (!Number.isFinite(value)) continue;
    const readings = clusters.get(cluster) ?? [];
    readings.push(value);
    clusters.set(cluster, readings);
  }
  const values = [...clusters.values()].map(median);
  if (!values.length) return null;

  const center = median(values);
  const deviations = values.map(value => Math.abs(value - center));
  // Convert median absolute deviation to a robust estimate of standard deviation.
  const threshold = 3 * 1.4826 * median(deviations);
  return median(values.filter((_, index) => deviations[index] <= threshold));
}

function median(values: number[]): number {
  const sorted = [...values].sort((first, second) => first - second);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : sorted[middle - 1] / 2 + sorted[middle] / 2;
}
