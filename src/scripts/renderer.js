import { setupDrawCanvas } from './draw.js';
import { setupEraseCanvas } from './eraser.js';
import { setupToggleDrawing } from './toggle.js';
import { setupThicknessControl } from './thickness.js';
import { setupMenuToggle } from './menu.js';
import { createUndoManager } from './undo.js';


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

  setupThicknessControl(
    thicknessDots,
    () => currentTool,
    (newThickness) => {
      pencilThickness = newThickness;
      if (currentTool === 'pencil') {
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness);
      }
    }
  );

  setupToggleDrawing(toggleBtn, canvas, () => drawingEnabled, (val) => {
    drawingEnabled = val;
    if (drawingEnabled) {
      setActiveTool(currentTool);
    } else {
      toolButtons.forEach(btn => btn.classList.remove('active'));
    }
  });

  setActiveTool(currentTool);

  // 🟦 Draggable Toolbar
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

  // 👁️ Setup Hamburger Menu Toggle
  setupMenuToggle('toolbar', 'hamburgerToggle', './scripts/images/eye.png', './scripts/images/close.png');
});
