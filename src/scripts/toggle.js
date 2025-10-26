const { ipcRenderer } = require("electron");

let internalDrawingEnabled = true;

// ✅ Setup toggle button logic
export function setupToggleDrawing(toggleBtn, canvas, setDrawingEnabled) {
  function updateToggleUI() {
    toggleBtn.classList.add("tool-button");
    toggleBtn.style.display = "flex";
    toggleBtn.style.visibility = "visible";
    toggleBtn.style.opacity = "1";
    toggleBtn.style.zIndex = "10001";

    const toolbar = document.getElementById("toolbar");
    if (toolbar) toolbar.style.pointerEvents = "auto";

    toggleBtn.classList.toggle("toggle-on", internalDrawingEnabled);
    toggleBtn.classList.toggle("toggle-off", !internalDrawingEnabled);

    canvas.classList.toggle("disabled", !internalDrawingEnabled);
    canvas.style.pointerEvents = internalDrawingEnabled ? "auto" : "none";
  }

  toggleBtn.addEventListener("click", () => {
    internalDrawingEnabled = !internalDrawingEnabled;
    setDrawingEnabled(internalDrawingEnabled);
    updateToggleUI();
    ipcRenderer.send("toggle-drawing-mode", internalDrawingEnabled);
  });

  internalDrawingEnabled = true;
  setDrawingEnabled(true);
  updateToggleUI();
}

// ✅ Disable drawing externally
export function disableDrawingExternally(toggleBtn, canvas, setDrawingEnabled) {
  internalDrawingEnabled = false;
  setDrawingEnabled(false);
  updateToggleUIState(toggleBtn, canvas, false);
  ipcRenderer.send("toggle-drawing-mode", false);
}

// ✅ Enable drawing externally (new function!)
export function enableDrawingExternally(toggleBtn, canvas, setDrawingEnabled) {
  internalDrawingEnabled = true;
  setDrawingEnabled(true);
  updateToggleUIState(toggleBtn, canvas, true);
  ipcRenderer.send("toggle-drawing-mode", true);
}

// 🔹 Helper for both enable/disable
function updateToggleUIState(toggleBtn, canvas, isEnabled) {
  toggleBtn.classList.toggle("toggle-on", isEnabled);
  toggleBtn.classList.toggle("toggle-off", !isEnabled);
  toggleBtn.style.display = "flex";
  toggleBtn.style.visibility = "visible";
  toggleBtn.style.opacity = "1";
  toggleBtn.style.zIndex = "10001";

  canvas.classList.toggle("disabled", !isEnabled);
  canvas.style.pointerEvents = isEnabled ? "auto" : "none";

  const toolbar = document.getElementById("toolbar");
  if (toolbar) toolbar.style.pointerEvents = "auto";
}
