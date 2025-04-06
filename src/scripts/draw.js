export function setupDrawCanvas(canvas, elements) {
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let currentPath = [];
  
    function startDrawing(e) {
      drawing = true;
      currentPath = [];
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      ctx.beginPath();
      ctx.moveTo(x, y);
      currentPath.push({ x, y });
    }
  
    function draw(e) {
      if (!drawing) return;
      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      ctx.lineTo(x, y);
      ctx.stroke();
      currentPath.push({ x, y });
    }
  
    function stopDrawing() {
      drawing = false;
      if (currentPath.length > 0) {
        elements.push({ type: 'line', points: [...currentPath] });
      }
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
  