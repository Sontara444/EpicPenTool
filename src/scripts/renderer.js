import { setupDrawCanvas } from "./draw.js";
import { setupEraseCanvas } from "./eraser.js";
import { setupToggleDrawing, disableDrawingExternally } from "./toggle.js";
import { setupThicknessControl } from "./thickness.js";
import { setupMenuToggle } from "./menu.js";
import { createUndoManager } from "./undo.js";
import { setupColorPicker } from "./colorpicker.js";
import { addToolbarLogo } from "./logo.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // ✅ Add logo to toolbar
  addToolbarLogo("toolbar", "./scripts/images/logo.png");

  const TOOLS = {
    PENCIL: "pencil",
    ERASER: "eraser",
    SHAPES: "shapes",
    CLEAR: "clear",
    UNDO: "undo",
  };

  let elements = [];
  let currentTool = TOOLS.PENCIL;
  let drawingEnabled = true;
  let pencilThickness = 2;
  let pencilColor = "blue";

  // ✅ Tool button elements
  const toggleBtn = document.getElementById("toggleBtn");
  const pencilBtn = document.getElementById("pencilBtn");
  const eraserBtn = document.getElementById("eraserBtn");
  const shapesBtn = document.getElementById("shapesBtn");
  const clearBtn = document.getElementById("clearBtn");
  const undoBtn = document.getElementById("undoBtn");
  const toolButtons = document.querySelectorAll(".tool-button");

  // ✅ Undo manager
  const undoManager = createUndoManager(elements, () => drawHandlers.redraw());

  // ✅ Set up drawing and erasing
  let drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
  let eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw, undoManager);

  function setActiveTool(tool) {
    toolButtons.forEach((btn) => btn.classList.remove("active"));
    if (tool === TOOLS.PENCIL) pencilBtn.classList.add("active");
    if (tool === TOOLS.ERASER) eraserBtn.classList.add("active");
    if (tool === TOOLS.SHAPES) shapesBtn.classList.add("active");
  }

  function handleToolClick(toolName, setupFn) {
    currentTool = toolName;
    setActiveTool(toolName);

    if (toolName === TOOLS.PENCIL) {
      drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
    } else if (toolName === TOOLS.ERASER) {
      eraseHandlers.cleanup?.();
      eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw, undoManager);
    }

    setupFn?.(); // Run custom logic if needed
  }

  // ✅ Tool button event listeners
  pencilBtn.addEventListener("click", () => handleToolClick(TOOLS.PENCIL));
  eraserBtn.addEventListener("click", () => handleToolClick(TOOLS.ERASER));
  shapesBtn.addEventListener("click", () => handleToolClick(TOOLS.SHAPES));

  clearBtn.addEventListener("click", () => {
    handleToolClick(TOOLS.CLEAR, () => {
      undoManager.saveState();
      drawHandlers.clearCanvas();
    });
  });

  undoBtn.addEventListener("click", () => {
    handleToolClick(TOOLS.UNDO, () => {
      undoManager.undo();
    });
  });

  // ✅ Setup toggle drawing mode (drawing enabled ON by default)
  setupToggleDrawing(toggleBtn, canvas, (val) => drawingEnabled = val);

  // ✅ Force toolbar pointer access again (safety)
  const toolbar = document.getElementById("toolbar");
  if (toolbar) {
    toolbar.style.pointerEvents = "auto";
    toolbar.style.zIndex = "10000";
  }

  // ✅ Setup thickness dots
  setupThicknessControl(
    document.querySelectorAll(".thickness-dot"),
    () => currentTool,
    (newThickness) => {
      pencilThickness = newThickness;
      if (currentTool === TOOLS.PENCIL) {
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
      }
    }
  );

  // ✅ Setup color picker
  setupColorPicker(
    document.getElementById("colorPicker"),
    (selectedColor) => {
      pencilColor = selectedColor;
      if (currentTool === TOOLS.PENCIL) {
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
      }
    }
  );

  // ✅ Set initial tool
  setActiveTool(currentTool);

  // ✅ Setup toolbar menu toggle (eye icon)
  setupMenuToggle("toolbar", "hamburgerToggle", "./scripts/images/eye.png", "./scripts/images/close.png");
});
