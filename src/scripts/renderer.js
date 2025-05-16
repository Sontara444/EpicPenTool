import { setupDrawCanvas } from "./draw.js";
import { setupEraseCanvas } from "./eraser.js";
import { setupToggleDrawing } from "./toggle.js";
import { setupThicknessControl } from "./thickness.js";
import { setupMenuToggle } from "./menu.js";
import { createUndoManager } from "./undo.js";
import { setupColorPicker } from "./colorpicker.js";




document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let elements = [];
  let currentTool = "pencil";
  let drawingEnabled = true;
  let pencilThickness = 2;
  let pencilColor = "blue"; // Default color



  const toggleBtn = document.getElementById("toggleBtn");
  const pencilBtn = document.getElementById("pencilBtn");
  const eraserBtn = document.getElementById("eraserBtn");
  const clearBtn = document.getElementById("clearBtn");
  const undoBtn = document.getElementById("undoBtn");
  const toolButtons = document.querySelectorAll(".tool-button");
  const thicknessDots = document.querySelectorAll(".thickness-dot");
  

  const undoManager = createUndoManager(elements, () => drawHandlers.redraw());

  let drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
  let eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw, undoManager);

  function setActiveTool(tool) {
    if (!drawingEnabled) return;
    toolButtons.forEach((btn) => btn.classList.remove("active"));
    if (tool === "pencil") pencilBtn.classList.add("active");
    if (tool === "eraser") eraserBtn.classList.add("active");
    if (tool === "shapes") shapesBtn.classList.add("active");
  }
  

  pencilBtn.addEventListener("click", () => {
    if (!drawingEnabled) return;
    currentTool = "pencil";
    drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
    setActiveTool("pencil");
  });

  eraserBtn.addEventListener("click", () => {
    if (!drawingEnabled) return;
    currentTool = "eraser";
    eraseHandlers = setupEraseCanvas(canvas, elements, drawHandlers.redraw, undoManager);
    setActiveTool("eraser");
  });

  clearBtn.addEventListener("click", () => {
    if (!drawingEnabled) return;
    undoManager.saveState(); // Save before clearing
    drawHandlers.clearCanvas();
  });

  undoBtn.addEventListener("click", () => {
    if (!drawingEnabled) return;
    undoManager.undo();
  });
  

  setupThicknessControl(
    thicknessDots,
    () => currentTool,
    (newThickness) => {
      pencilThickness = newThickness;
      if (currentTool === "pencil") {
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
      }
    }
  );

  setupToggleDrawing(
    toggleBtn,
    canvas,
    () => drawingEnabled,
    (val) => {
      drawingEnabled = val;
      if (drawingEnabled) {
        setActiveTool(currentTool);
      } else {
        toolButtons.forEach((btn) => btn.classList.remove("active"));
      }
    }
  );

  setupColorPicker(
    document.getElementById("colorPicker"),
    (selectedColor) => {
      pencilColor = selectedColor;
      if (currentTool === "pencil") {
        drawHandlers = setupDrawCanvas(canvas, elements, pencilThickness, undoManager, pencilColor);
      }
    }
  );

  setActiveTool(currentTool);

    // 🟦 Draggable Toolbar (Improved)
    const toolbar = document.getElementById("toolbar");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
  
    toolbar.style.position = "absolute";
  
    toolbar.addEventListener("mousedown", (e) => {
      if (
        e.target.closest("button") ||
        e.target.closest("input") ||
        e.target.closest(".thickness-wrapper")
      ) return;
  
      isDragging = true;
  
      const rect = toolbar.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
  
      toolbar.style.opacity = "0.9";
      document.body.style.userSelect = "none";
    });
  
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      toolbar.style.left = `${e.clientX - offsetX}px`;
      toolbar.style.top = `${e.clientY - offsetY}px`;
    });
  
    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      toolbar.style.opacity = "1";
      document.body.style.userSelect = "auto";
    });
  



  // 👁️ Hamburger Menu Toggle
  setupMenuToggle(
    "toolbar",
    "hamburgerToggle",
    "./scripts/images/eye.png",
    "./scripts/images/close.png"
  );
});
