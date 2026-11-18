export interface Claim { level: number; need: number; weight: number }

/** Allocate proportionally to weighted need, redistributing any excess from capped claims. */
export function fairShare(supply: number, claims: Claim[]): Record<number, number> {
  const allocation = Object.fromEntries(claims.map(({ level }) => [level, 0]));
  const active = claims.filter(claim => claim.need > 0 && claim.weight > 0)
    .sort((first, second) => second.weight - first.weight);
  let remaining = Math.max(0, supply);
  let totalWeightedNeed = active.reduce((sum, claim) => sum + claim.need * claim.weight, 0);
  for (const [index, claim] of active.entries()) {
    const fraction = remaining / totalWeightedNeed;
    if (fraction * claim.weight < 1) {
      for (const pending of active.slice(index)) {
        allocation[pending.level] = fraction * pending.need * pending.weight;
      }
      break;
    }
    allocation[claim.level] = claim.need;
    remaining = Math.max(0, remaining - claim.need);
    totalWeightedNeed -= claim.need * claim.weight;
  }
  return allocation;
}

export function directorateShare(supply: number, claims: Claim[]): Record<number, number> {
  const allocation: Record<number, number> = {};
  let remaining = Math.max(0, supply);
  for (const claim of [...claims].sort((first, second) => first.level - second.level)) {
    const amount = Math.min(remaining, Math.max(0, claim.need));
    allocation[claim.level] = amount;
    remaining -= amount;
  }
  return allocation;
}
