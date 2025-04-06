export function setupEraseCanvas(canvas, elements, redraw) {
    const ctx = canvas.getContext('2d');
  
    function erase(event) {
      const mouseX = event.clientX - canvas.offsetLeft;
      const mouseY = event.clientY - canvas.offsetTop;
      const threshold = 10;
  
      const indexToRemove = elements.findIndex(element =>
        element.type === 'line' &&
        element.points.some(p => Math.hypot(p.x - mouseX, p.y - mouseY) < threshold)
      );
  
      if (indexToRemove !== -1) {
        elements.splice(indexToRemove, 1);
        redraw();
      }
    }
  
    canvas.removeEventListener('click', erase);
    canvas.addEventListener('click', erase);
  }
  