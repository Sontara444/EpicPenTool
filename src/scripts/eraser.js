export function setupEraseCanvas(canvas, elements, redraw, undoManager, eraserSize = 20) {
  const ctx = canvas.getContext("2d");
  let isErasing = false;
  let currentPath = [];
  let stateSaved = false;

  const startErasing = (e) => {
    if (canvas.classList.contains('disabled')) return;
    isErasing = true;
    stateSaved = false;
    currentPath = [];

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(x, y);
    currentPath.push({ x, y });
  };

  const erase = (e) => {
    if (!isErasing) return;
    
    if (!stateSaved && undoManager?.saveState) {
      undoManager.saveState();
      stateSaved = true;
    }

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    
    ctx.lineWidth = eraserSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineTo(x, y);
    ctx.stroke();
    currentPath.push({ x, y });
  };

  const stopErasing = () => {
    if (isErasing && currentPath.length > 1) {
      elements.push({ type: 'erase', points: [...currentPath], thickness: eraserSize });
    }
    isErasing = false;
    ctx.globalCompositeOperation = 'source-over'; // Reset to normal drawing
  };

  if (canvas._eraseMouseDown) canvas.removeEventListener("mousedown", canvas._eraseMouseDown);
  if (canvas._eraseMouseUp) canvas.removeEventListener("mouseup", canvas._eraseMouseUp);
  if (canvas._eraseMouseMove) canvas.removeEventListener("mousemove", canvas._eraseMouseMove);

  canvas._eraseMouseDown = startErasing;
  canvas._eraseMouseUp = stopErasing;
  canvas._eraseMouseMove = erase;

  canvas.addEventListener("mousedown", startErasing);
  canvas.addEventListener("mouseup", stopErasing);
  canvas.addEventListener("mousemove", erase);

  return {
    cleanup() {
      canvas.removeEventListener("mousedown", startErasing);
      canvas.removeEventListener("mouseup", stopErasing);
      canvas.removeEventListener("mousemove", erase);
      delete canvas._eraseMouseDown;
      delete canvas._eraseMouseUp;
      delete canvas._eraseMouseMove;
      ctx.globalCompositeOperation = 'source-over';
    },
  };
}
