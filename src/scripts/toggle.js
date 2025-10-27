const { ipcRenderer } = require("electron");

let internalDrawingEnabled = true;

export function setupToggleDrawing(toggleBtn, canvas, setDrawingEnabled) {
  function updateToggleUI() {
    toggleBtn.classList.toggle("toggle-on", internalDrawingEnabled);
    toggleBtn.classList.toggle("toggle-off", !internalDrawingEnabled);

    canvas.style.pointerEvents = internalDrawingEnabled ? "auto" : "none";
    canvas.classList.toggle("disabled", !internalDrawingEnabled);

    const toolbar = document.getElementById("toolbar");
    if (toolbar) toolbar.style.pointerEvents = "auto";
  }

  toggleBtn.addEventListener("click", () => {
    internalDrawingEnabled = !internalDrawingEnabled;
    setDrawingEnabled(internalDrawingEnabled);
    updateToggleUI();
    ipcRenderer.send("toggle-drawing-mode", internalDrawingEnabled);
  });

  // Initial setup
  internalDrawingEnabled = true;
  setDrawingEnabled(true);
  updateToggleUI();
}

// 🔹 Disable drawing externally (from other file)
export function disableDrawingExternally(toggleBtn, canvas, setDrawingEnabled) {
  internalDrawingEnabled = false;
  setDrawingEnabled(false);
  canvas.style.pointerEvents = "none";
  toggleBtn.classList.remove("toggle-on");
  toggleBtn.classList.add("toggle-off");
  ipcRenderer.send("toggle-drawing-mode", false);
}

// 🔹 Enable drawing externally (from other file)
export function enableDrawingExternally(toggleBtn, canvas, setDrawingEnabled) {
  internalDrawingEnabled = true;
  setDrawingEnabled(true);
  canvas.style.pointerEvents = "auto";
  toggleBtn.classList.remove("toggle-off");
  toggleBtn.classList.add("toggle-on");
  ipcRenderer.send("toggle-drawing-mode", true);
}
