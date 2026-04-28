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
    window.electronAPI.toggleDrawingMode(internalDrawingEnabled);
  });

  // Initial setup
  internalDrawingEnabled = true;
  setDrawingEnabled(true);
  updateToggleUI();
}

export function setDrawingMode(enable, buttonElement, canvasElement, callback) {
  if (enable) {
    buttonElement.classList.add("active", "toggle-on");
    buttonElement.classList.remove("toggle-off");
    canvasElement.classList.remove("disabled");
    canvasElement.style.pointerEvents = "auto";
    if (window.electronAPI) {
      window.electronAPI.toggleDrawingMode(true);
    }
  } else {
    buttonElement.classList.add("toggle-off");
    buttonElement.classList.remove("active", "toggle-on");
    canvasElement.classList.add("disabled");
    canvasElement.style.pointerEvents = "none";
    if (window.electronAPI) {
      window.electronAPI.toggleDrawingMode(false);
    }
  }
  callback(enable);
}
