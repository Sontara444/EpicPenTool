export function setupThicknessControl(dots, getTool, onSelectThickness) {
    const selector = document.getElementById('thicknessSelector');
    let isExpanded = false;
  
    selector.addEventListener('click', (e) => {
      const clickedDot = e.target.closest('.thickness-dot');
      if (!clickedDot) return;
  
      const size = clickedDot.getAttribute('data-size');
  
      if (!isExpanded) {
        // Expand to show all
        selector.classList.remove('collapsed');
        isExpanded = true;
        return;
      }
  
      if (size) {
        // Apply thickness
        onSelectThickness(Number(size));
  
        // Move clicked dot to first child in the DOM so it stays visible when collapsed
        selector.insertBefore(clickedDot, selector.firstElementChild);
  
        // Collapse again
        selector.classList.add('collapsed');
        isExpanded = false;
      }
    });
  }
  