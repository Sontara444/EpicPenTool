export function setupDrawCanvas(canvas, elements, thickness = 2, undoManager, color = "#000000", isHighlighter = false) {
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
    ctx.lineCap = isHighlighter ? 'butt' : 'round'; // Butt looks more like a marker
    ctx.strokeStyle = color;
    ctx.globalAlpha = isHighlighter ? 0.4 : 1.0;
    
    // If it's a highlighter, we don't want the stroke to compound heavily on itself during the live draw,
    // but the standard way is fine for now.
    ctx.lineTo(x, y);
    ctx.stroke();
    currentPath.push({ x, y });
  };

  const stopDrawing = () => {
    if (drawing && currentPath.length > 1) {
      elements.push({ type: isHighlighter ? 'highlight' : 'line', points: [...currentPath], thickness, color });
    }
    drawing = false;
    ctx.globalAlpha = 1.0; // Reset
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
        ctx.globalAlpha = element.type === 'highlight' ? 0.4 : 1.0;
        
        if (element.type === 'line' || element.type === 'erase' || element.type === 'highlight') {
          ctx.globalCompositeOperation = element.type === 'erase' ? 'destination-out' : 'source-over';
          ctx.beginPath();
          ctx.lineWidth = element.thickness || 2;
          ctx.lineCap = element.type === 'highlight' ? 'butt' : 'round';
          ctx.strokeStyle = element.type === 'erase' ? 'rgba(0,0,0,1)' : (element.color || "#000000");
          element.points.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        } else if (element.type === 'shape') {
          ctx.globalCompositeOperation = 'source-over';
          ctx.beginPath();
          ctx.lineWidth = element.thickness || 2;
          ctx.lineCap = 'round';
          ctx.strokeStyle = element.color || "#000000";
          if (element.shapeType === 'line') {
            ctx.moveTo(element.x1, element.y1);
            ctx.lineTo(element.x2, element.y2);
          }
          ctx.stroke();
        }
      });
      ctx.globalCompositeOperation = 'source-over'; // Reset back to normal
      ctx.globalAlpha = 1.0; // Reset
    },
    cleanup: () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      ctx.globalAlpha = 1.0; // Reset
    }
  };
}
