export function setupDrawCanvas(canvas, elements, thickness = 2, undoManager, color = "#000000") {
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let currentPath = [];
  let stateSaved = false;

  function startDrawing(e) {
    drawing = true;
    stateSaved = false;
    currentPath = [];

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    ctx.beginPath();
    ctx.moveTo(x, y);
    currentPath.push({ x, y });
  }

  function draw(e) {
    if (!drawing) return;

    if (!stateSaved && undoManager?.saveState) {
      undoManager.saveState(); // Save the first time movement happens
      stateSaved = true;
    }

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color; // Use the selected color
    ctx.lineTo(x, y);
    ctx.stroke();
    currentPath.push({ x, y });
  }

  function stopDrawing() {
    if (drawing && currentPath.length > 1) {
      elements.push({ type: 'line', points: [...currentPath], thickness, color });
    }
    drawing = false;
  }

  canvas.removeEventListener('mousedown', startDrawing);
  canvas.removeEventListener('mousemove', draw);
  canvas.removeEventListener('mouseup', stopDrawing);

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
      elements.forEach(element => {
        if (element.type === 'line') {
          ctx.beginPath();
          ctx.lineWidth = element.thickness || 2;
          ctx.strokeStyle = element.color || "#000000"; // Use stored color
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