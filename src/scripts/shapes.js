export function setupShapesTool(canvas, elements, redraw, undoManager, thickness, color) {
  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let startX, startY;

  function handleMouseDown(e) {
    if (canvas.classList.contains('disabled')) return;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDrawing = true;
  }

  let rafId = null;

  function handleMouseMove(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      redraw(); // Clear and redraw existing elements
      
      // Draw the temporary preview line
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    });
  }

  function handleMouseUp(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (startX !== endX || startY !== endY) {
      if (undoManager?.saveState) undoManager.saveState();
      
      const shape = {
        type: "shape",
        shapeType: "line",
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
        color: color,
        thickness: thickness
      };

      elements.push(shape);
    }
    
    redraw(); // Commit the drawing
    isDrawing = false;
  }

  if (canvas._shapesMouseDown) canvas.removeEventListener("mousedown", canvas._shapesMouseDown);
  if (canvas._shapesMouseMove) canvas.removeEventListener("mousemove", canvas._shapesMouseMove);
  if (canvas._shapesMouseUp) canvas.removeEventListener("mouseup", canvas._shapesMouseUp);

  canvas._shapesMouseDown = handleMouseDown;
  canvas._shapesMouseMove = handleMouseMove;
  canvas._shapesMouseUp = handleMouseUp;

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);

  return {
    cleanup() {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      delete canvas._shapesMouseDown;
      delete canvas._shapesMouseMove;
      delete canvas._shapesMouseUp;
    }
  };
}
