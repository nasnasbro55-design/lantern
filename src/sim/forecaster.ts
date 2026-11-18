// Owner: Kevin. Fits a short linear trend to a sensor series and projects when it crosses a danger line.
import type { Alert, Kind } from './types';

/** Returns an Alert for one level and kind, or null when no crossing is projected. */
export function forecast(level: number, kind: Kind, history: number[], danger: number): Alert | null {
  // TODO: least-squares slope over the last few ticks, eta = ticks until value crosses danger
  void level; void kind; void history; void danger;
  return null;
}
