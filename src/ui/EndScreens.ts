
// Owner: Nashwan (logic) and Sophia (look). Win and lose flow.
export function showEnd(root: HTMLElement, won: boolean): void {
  root.replaceChildren(); // Clear old content

  // Create the result heading
  const heading = document.createElement('h2');
  heading.textContent = won ? 'Victory!' : 'Game Over!';

  // Explain why the player won or lost
  const message = document.createElement('p');
  message.textContent = won
    ? 'The deep levels survived, and the surface is confirmed safe!'
    : 'A level went dark without warning or a mesh path to help it.';

  // Set CSS class for Sophia to style
  root.className = won ? 'end-screen win' : 'end-screen lose';

  // Display the result
  root.append(heading, message);
}
