
// Owner: Nashwan. Early warning feed in the HUD ("power cut in about 12 hours").
import type { Alert } from '../sim/types';

export function renderWarnings(root: HTMLElement, alerts: Alert[]): void {
  root.replaceChildren(); // Clear old warnings

  // Sort warnings by time (soonest first)
  const sorted = [...alerts].sort((a, b) => a.eta - b.eta);

  // Show message if there are no warnings
  if (sorted.length === 0) {
    root.textContent = 'No active warnings.';
    return;
  }

  // Create a row for each warning
  for (const alert of sorted) {
    const row = document.createElement('div');
    row.className = `warning ${alert.severity}`;

    // Display warning information
    row.textContent = `Level ${alert.level}: ${alert.kind} - Danger in ${alert.eta} hours`;

    root.appendChild(row); // Add warning to screen
  }
}
