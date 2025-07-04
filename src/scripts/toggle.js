const { ipcRenderer } = require("electron");

let internalDrawingEnabled = true;

export function setupToggleDrawing(toggleBtn, canvas, setDrawingEnabled) {
  function updateToggleUI() {
    toggleBtn.classList.add("tool-button");
    toggleBtn.style.display = "flex";
    toggleBtn.style.visibility = "visible";
    toggleBtn.style.opacity = "1";
    toggleBtn.style.zIndex = "10001";

    // Re-enable toolbar interactions
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

export function disableDrawingExternally(toggleBtn, canvas, setDrawingEnabled) {
  internalDrawingEnabled = false;
  setDrawingEnabled(false);

  toggleBtn.classList.remove("toggle-on");
  toggleBtn.classList.add("toggle-off");
  toggleBtn.style.display = "flex";
  toggleBtn.style.visibility = "visible";
  toggleBtn.style.opacity = "1";
  toggleBtn.style.zIndex = "10001";

  canvas.classList.add("disabled");
  canvas.style.pointerEvents = "none";

  ipcRenderer.send("toggle-drawing-mode", false);

  const toolbar = document.getElementById("toolbar");
  if (toolbar) toolbar.style.pointerEvents = "auto";
}
