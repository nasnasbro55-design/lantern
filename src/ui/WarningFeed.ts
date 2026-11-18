// Owner: Nashwan. Early warning feed in the HUD ("power cut in about 12 hours").
import type { Alert } from '../sim/types';

export function renderWarnings(root: HTMLElement, alerts: Alert[]): void {
  // TODO: one row per alert, sorted by eta, severity as a CSS class (watch, high, critical)
  void root; void alerts;
}
