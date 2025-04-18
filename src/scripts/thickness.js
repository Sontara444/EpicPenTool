export function setupThicknessControl(dots, getTool, onSelectThickness) {
    const selector = document.getElementById('thicknessSelector');
    let isExpanded = false;
  
    // Collapse initially
    dots.forEach((dot, i) => {
      if (i !== 0) dot.style.display = 'none';
    });
  
    selector.addEventListener('click', (e) => {
      const clickedDot = e.target.closest('.thickness-dot');
      if (!clickedDot) return;
  
      const size = clickedDot.getAttribute('data-size');
  
      if (!isExpanded) {
        // Expand to show all
        selector.classList.remove('collapsed');
        dots.forEach(dot => dot.style.display = 'inline-block');
        isExpanded = true;
        return;
      }
  
      if (size) {
        // Apply thickness
        onSelectThickness(Number(size));
  
        // Move clicked dot to first
        const first = dots[0];
        selector.insertBefore(clickedDot, first);
  
        // Collapse again
        selector.classList.add('collapsed');
        dots.forEach((dot, i) => {
          dot.style.display = i === 0 ? 'inline-block' : 'none';
        });
  
        isExpanded = false;
      }
    });
  }
  