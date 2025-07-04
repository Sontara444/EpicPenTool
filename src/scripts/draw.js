export function setupDrawCanvas(canvas, elements, thickness = 2, undoManager, color = "#000000") {
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let currentPath = [];
  let stateSaved = false;

  const startDrawing = (e) => {
    if (canvas.classList.contains('disabled')) return;
    drawing = true;
    stateSaved = false;
    currentPath = [];

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    ctx.beginPath();
    ctx.moveTo(x, y);
    currentPath.push({ x, y });
  };

  const draw = (e) => {
    if (!drawing) return;
    if (!stateSaved && undoManager?.saveState) {
      undoManager.saveState();
      stateSaved = true;
    }

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    currentPath.push({ x, y });
  };

  const stopDrawing = () => {
    if (drawing && currentPath.length > 1) {
      elements.push({ type: 'line', points: [...currentPath], thickness, color });
    }
    drawing = false;
  };

  // ✅ Remove existing listeners before adding new ones
  canvas.removeEventListener('mousedown', canvas._startDraw);
  canvas.removeEventListener('mousemove', canvas._drawMove);
  canvas.removeEventListener('mouseup', canvas._stopDraw);

  canvas._startDraw = startDrawing;
  canvas._drawMove = draw;
  canvas._stopDraw = stopDrawing;

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);

  return {
    clearCanvas: () => {
      elements.length = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    redraw: () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elements.forEach((element) => {
        if (element.type === 'line') {
          ctx.beginPath();
          ctx.lineWidth = element.thickness || 2;
          ctx.strokeStyle = element.color || "#000000";
          element.points.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
      });
    }
  };
}
