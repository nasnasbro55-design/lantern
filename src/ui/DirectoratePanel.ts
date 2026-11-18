
 // Owner: Nashwan. Directorate vs Lantern panel: shows official values until a level is sensed, then truth.
import type { LevelState } from '../sim/types';

export function renderPanel(root: HTMLElement, level: LevelState): void {
  root.replaceChildren(); // Clear old data

  // Show truth if sensed, otherwise official data
  const data = level.sensed ? level.truth : level.official;

  // Create panel heading
  const heading = document.createElement('h3');
  heading.textContent = level.sensed
    ? `Level ${level.level} - Lantern Data`
    : `Level ${level.level} - Directorate Data`;

  root.appendChild(heading);

  // Display each reading
  for (const [kind, value] of Object.entries(data)) {
    const row = document.createElement('div');
    row.className = 'panel-row';
    row.textContent = `${kind}: ${value}`;

    root.appendChild(row); // Add reading to panel
  }
}
