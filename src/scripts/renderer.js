import { setupDrawCanvas } from "./draw.js";
import { setupShapesTool } from "./shapes.js";
import { setupEraseCanvas } from "./eraser.js";
import { setupToggleDrawing, setDrawingMode } from "./toggle.js";
import { setupThicknessControl } from "./thickness.js";
import { setupMenuToggle } from "./menu.js";
import { createUndoManager } from "./undo.js";
import { setupColorPicker } from "./colorpicker.js";
import { addToolbarLogo } from "./logo.js";
import { setupDraggableToolbar } from "./dragToolbar.js";
import { setupDragAndDrop } from "./dragDrop.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  addToolbarLogo("toolbar", "./scripts/images/logo.png");
  setupDraggableToolbar("toolbar");

  const TOOLS = {
    PENCIL: "pencil",
    HIGHLIGHTER: "highlighter",
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

  const toggleBtn = document.getElementById("toggleBtn");
  const pencilBtn = document.getElementById("pencilBtn");
  const highlighterBtn = document.getElementById("highlighterBtn");
  const eraserBtn = document.getElementById("eraserBtn");
  const shapesBtn = document.getElementById("shapesBtn");
  const clearBtn = document.getElementById("clearBtn");
  const whiteboardBtn = document.getElementById("whiteboardBtn");
  const undoBtn = document.getElementById("undoBtn");
  const toolButtons = document.querySelectorAll(".tool-button");

  const undoManager = createUndoManager(elements, () => drawHandlers.redraw());

  let drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
  
  // Setup drag and drop for images
  setupDragAndDrop(canvas, elements, drawHandlers.redraw, undoManager);
  let eraseHandlers = null;
  let shapeHandlers = null;

  function setActiveTool(tool) {
    [pencilBtn, highlighterBtn, eraserBtn, shapesBtn].forEach(btn => btn.classList.remove("active"));
    if (tool === TOOLS.PENCIL) pencilBtn.classList.add("active");
    if (tool === TOOLS.HIGHLIGHTER) highlighterBtn.classList.add("active");
    if (tool === TOOLS.ERASER) eraserBtn.classList.add("active");
    if (tool === TOOLS.SHAPES) shapesBtn.classList.add("active");
  }

  // ✅ Automatically re-enable drawing when any tool is clicked
  function handleToolClick(toolName) {
    if (currentTool === toolName) return;

    currentTool = toolName;
    setActiveTool(toolName);

    if (!drawingEnabled) {
      setDrawingMode(true, toggleBtn, canvas, (val) => (drawingEnabled = val));
    }

    if (drawHandlers?.cleanup) drawHandlers.cleanup();
    if (eraseHandlers?.cleanup) eraseHandlers.cleanup();
    if (shapeHandlers?.cleanup) shapeHandlers.cleanup();

    if (toolName === TOOLS.PENCIL) {
      drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor, false);
    } else if (toolName === TOOLS.HIGHLIGHTER) {
      // Highlighter draws thicker by default, so we scale the thickness slightly, and pass true for isHighlighter
      drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness * 3, undoManager, pencilColor, true);
    } else if (toolName === TOOLS.ERASER) {
      eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw, undoManager, pencilThickness * 5);
    } else if (toolName === TOOLS.SHAPES) {
      shapeHandlers = setupShapesTool(canvas, elements, drawHandlers.redraw, undoManager, pencilThickness, pencilColor);
    }
  }

  pencilBtn.addEventListener("click", () => handleToolClick(TOOLS.PENCIL));
  highlighterBtn.addEventListener("click", () => handleToolClick(TOOLS.HIGHLIGHTER));
  eraserBtn.addEventListener("click", () => handleToolClick(TOOLS.ERASER));
  shapesBtn.addEventListener("click", () => handleToolClick(TOOLS.SHAPES));

  clearBtn.addEventListener("click", () => {
    undoManager.saveState();
    drawHandlers.clearCanvas();
  });

  let isWhiteboard = false;
  whiteboardBtn.addEventListener("click", () => {
    isWhiteboard = !isWhiteboard;
    if (isWhiteboard) {
      canvas.style.backgroundColor = "#ffffff";
      whiteboardBtn.classList.add("active");
    } else {
      canvas.style.backgroundColor = "transparent";
      whiteboardBtn.classList.remove("active");
    }
  });

  undoBtn.addEventListener("click", () => {
    undoManager.undo();
  });

  // ✅ Setup toggle (drawing on/off)
  setupToggleDrawing(toggleBtn, canvas, (val) => (drawingEnabled = val));

  // ✅ Close button logic
  const closeBtn = document.getElementById("closeBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (window.electronAPI && window.electronAPI.closeApp) {
        window.electronAPI.closeApp();
      }
    });
  }

  // ✅ Setup thickness
  setupThicknessControl(
    document.querySelectorAll(".thickness-dot"),
    () => currentTool,
    (newThickness) => {
      pencilThickness = newThickness;
      if (currentTool === TOOLS.PENCIL) {
        if (drawHandlers?.cleanup) drawHandlers.cleanup();
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor, false);
      } else if (currentTool === TOOLS.HIGHLIGHTER) {
        if (drawHandlers?.cleanup) drawHandlers.cleanup();
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness * 3, undoManager, pencilColor, true);
      } else if (currentTool === TOOLS.ERASER) {
        if (eraseHandlers?.cleanup) eraseHandlers.cleanup();
        eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw, undoManager, pencilThickness * 5);
      } else if (currentTool === TOOLS.SHAPES) {
        if (shapeHandlers?.cleanup) shapeHandlers.cleanup();
        shapeHandlers = setupShapesTool(canvas, elements, drawHandlers.redraw, undoManager, pencilThickness, pencilColor);
      }
    }
  );

  // ✅ Setup color picker
  setupColorPicker(
    document.getElementById("colorPicker"),
    (selectedColor) => {
      pencilColor = selectedColor;
      if (currentTool === TOOLS.PENCIL) {
        if (drawHandlers?.cleanup) drawHandlers.cleanup();
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor, false);
      } else if (currentTool === TOOLS.HIGHLIGHTER) {
        if (drawHandlers?.cleanup) drawHandlers.cleanup();
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness * 3, undoManager, pencilColor, true);
      } else if (currentTool === TOOLS.SHAPES) {
        if (shapeHandlers?.cleanup) shapeHandlers.cleanup();
        shapeHandlers = setupShapesTool(canvas, elements, drawHandlers.redraw, undoManager, pencilThickness, pencilColor);
      }
    }
  );

  // ✅ Fix toolbar click-through bug
  const toolbarEl = document.getElementById("toolbar");
  if (toolbarEl) {
    toolbarEl.addEventListener("mouseenter", () => {
      if (!drawingEnabled && window.electronAPI && window.electronAPI.toggleDrawingMode) {
        // Re-enable pointer events for the window while hovering the toolbar
        window.electronAPI.toggleDrawingMode(true);
      }
    });
    toolbarEl.addEventListener("mouseleave", () => {
      if (!drawingEnabled && window.electronAPI && window.electronAPI.toggleDrawingMode) {
        // Re-disable pointer events for the window when leaving the toolbar
        window.electronAPI.toggleDrawingMode(false);
      }
    });
  }

  // ✅ Menu (eye icon)
  setupMenuToggle("toolbar", "hamburgerToggle", "./scripts/images/eye.png", "./scripts/images/close.png");

  // ✅ Global Hotkey Listener
  if (window.electronAPI && window.electronAPI.onToggleDrawingShortcut) {
    window.electronAPI.onToggleDrawingShortcut(() => {
      toggleBtn.click();
    });
  }

  // ✅ Resize Listener to keep canvas full screen
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawHandlers.redraw();
  });

  setActiveTool(currentTool);
});
