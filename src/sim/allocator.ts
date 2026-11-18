// Owner: Kevin. Fair-share (weighted max-min) vs Directorate top-down allocation.
export interface Claim { level: number; need: number; weight: number }

/** Returns the amount each level receives, never more than its need. */
export function fairShare(supply: number, claims: Claim[]): Record<number, number> {
  // TODO: weighted max-min; weight grows with heat and sickness
  void supply; void claims;
  return {};
}

export function directorateShare(supply: number, claims: Claim[]): Record<number, number> {
  // TODO: top-down rule, upper levels first
  void supply; void claims;
  return {};
}
