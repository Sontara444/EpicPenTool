import { setupDrawCanvas } from './draw.js';
import { setupEraseCanvas } from './eraser.js';
import { setupToggleDrawing } from './toggle.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let elements = [];
  let currentTool = 'pencil';
  let drawingEnabled = true;
  let pencilThickness = 2;

  const toggleBtn = document.getElementById('toggleBtn');
  const pencilBtn = document.getElementById('pencilBtn');
  const eraserBtn = document.getElementById('eraserBtn');
  const clearBtn = document.getElementById('clearBtn');
  const toolButtons = document.querySelectorAll('.tool-button');
  const thicknessWrapper = document.querySelector('.thickness-wrapper');
  const thicknessDots = document.querySelectorAll('.thickness-dot');

  let drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness);
  let eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw);

  function setActiveTool(tool) {
    if (!drawingEnabled) return;
    toolButtons.forEach(btn => btn.classList.remove('active'));
    if (tool === 'pencil') pencilBtn.classList.add('active');
    if (tool === 'eraser') eraserBtn.classList.add('active');
  }

  pencilBtn.addEventListener('click', () => {
    if (!drawingEnabled) return;
    currentTool = 'pencil';
    drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness);
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

  thicknessDots.forEach(dot => {
    dot.addEventListener('click', () => {
      pencilThickness = parseInt(dot.dataset.size, 10);
      thicknessDots.forEach(d => d.classList.remove('selected'));
      dot.classList.add('selected');
      if (currentTool === 'pencil') {
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness);
      }
    });
  });

  // 🌟 Toggle drawing mode
  setupToggleDrawing(toggleBtn, canvas, () => drawingEnabled, (val) => {
    drawingEnabled = val;
    if (drawingEnabled) {
      setActiveTool(currentTool);
    } else {
      toolButtons.forEach(btn => btn.classList.remove('active'));
    }
  });

  setActiveTool(currentTool);
  document.querySelector('.thickness-dot[data-size="2"]').classList.add('selected');

  // 🔱 Draggable Toolbar
  const toolbar = document.getElementById('toolbar');
  let isDragging = false, offsetX = 0, offsetY = 0;

  toolbar.addEventListener('mousedown', (e) => {
    if (!e.target.closest('button') && !e.target.closest('.thickness-wrapper')) {
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

  // 👁️ Hamburger Toggle Logic
  const hamburgerBtn = document.getElementById('hamburgerToggle');
  const eyeIcon = document.getElementById('eyeIcon');
  let toolbarVisible = true;

  hamburgerBtn.addEventListener('click', () => {
    toolbarVisible = !toolbarVisible;
    toolbar.style.display = toolbarVisible ? 'flex' : 'none';
    if (eyeIcon) {
      eyeIcon.src = toolbarVisible
        ? './scripts/images/eye.png'
        : './scripts/images/close.png';
    }
  });
});
