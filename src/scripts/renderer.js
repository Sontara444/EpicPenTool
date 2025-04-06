import { setupDrawCanvas } from './draw.js';
import { setupEraseCanvas } from './eraser.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let elements = [];
  let currentTool = 'pencil';
  let drawingEnabled = true;

  let drawHandlers = setupDrawCanvas(canvas, elements);
  let eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw);

  const toggleBtn = document.getElementById('toggleBtn');
  const pencilBtn = document.getElementById('pencilBtn');
  const eraserBtn = document.getElementById('eraserBtn');
  const clearBtn = document.getElementById('clearBtn');
  const toolButtons = document.querySelectorAll('.tool-button');

  function setActiveTool(tool) {
    if (!drawingEnabled) return;
    toolButtons.forEach(btn => btn.classList.remove('active'));
    if (tool === 'pencil') pencilBtn.classList.add('active');
    else if (tool === 'eraser') eraserBtn.classList.add('active');
  }

  pencilBtn.addEventListener('click', () => {
    if (!drawingEnabled) return;
    currentTool = 'pencil';
    drawHandlers = setupDrawCanvas(canvas, elements);
    setActiveTool('pencil');
  });

  eraserBtn.addEventListener('click', () => {
    if (!drawingEnabled) return;
    currentTool = 'eraser';
    eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw);
    setActiveTool('eraser');
  });

  clearBtn.addEventListener('click', () => {
    if (!drawingEnabled) return;
    drawHandlers.clearCanvas();
  });

  // ✅ Toggle Drawing Mode
  toggleBtn.addEventListener('click', () => {
    drawingEnabled = !drawingEnabled;
    canvas.classList.toggle('disabled', !drawingEnabled);

    toggleBtn.classList.toggle('toggle-on', drawingEnabled);
    toggleBtn.classList.toggle('toggle-off', !drawingEnabled);

    if (!drawingEnabled) {
      toolButtons.forEach(btn => btn.classList.remove('active'));
    } else {
      setActiveTool(currentTool);
    }
  });

  setActiveTool(currentTool);
  toggleBtn.classList.add('toggle-on');

  // 🖱️ Draggable Toolbar
  const toolbar = document.getElementById('toolbar');
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  toolbar.addEventListener('mousedown', (e) => {
    if (!e.target.closest('button')) {
      isDragging = true;
      offsetX = e.clientX - toolbar.offsetLeft;
      offsetY = e.clientY - toolbar.offsetTop;
      toolbar.style.opacity = '0.9';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      toolbar.style.left = `${e.clientX - offsetX}px`;
      toolbar.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    toolbar.style.opacity = '1';
  });
});
