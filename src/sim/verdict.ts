// Owner: Kevin. Surface verdict: median per probe cluster, then a robust median across clusters, rejecting outlier clusters.
export interface Probe { cluster: string; value: number }

export function surfaceVerdict(probes: Probe[]): number | null {
  // TODO: one median per cluster, robust median across clusters, drop outliers, so one group counts once
  void probes;
  return null;
}
