
// Owner: Nashwan. Choose Directorate top-down or fair-share allocation of power, water and food.
export type AllocationRule = 'directorate' | 'fair';

export function showAllocation(root: HTMLElement, onChoose: (rule: AllocationRule) => void): void {
  root.replaceChildren(); // Clear old content

  // Create screen heading
  const heading = document.createElement('h3');
  heading.textContent = 'Choose Resource Allocation';
  root.appendChild(heading);

  // Create the two allocation options
  const options: { rule: AllocationRule; description: string }[] = [
    {
      rule: 'directorate',
      description: 'Government controls how power, water, and food are shared.'
    },
    {
      rule: 'fair',
      description: 'Resources are shared based on each level’s needs.'
    }
  ];

  // Create a button for each option
  for (const option of options) {
    const button = document.createElement('button');
    button.className = 'allocation-button';
    button.textContent = `${option.rule.toUpperCase()}: ${option.description}`;

    // Send the player's choice to the game
    button.addEventListener('click', () => onChoose(option.rule));

    root.appendChild(button);
  }
}
