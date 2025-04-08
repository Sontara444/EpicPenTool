const { ipcRenderer } = require('electron');

export function setupToggleDrawing(toggleBtn, canvas, getDrawingEnabled, setDrawingEnabled) {
  let drawingEnabled = true; // Local state

  function updateToggleUI() {
    toggleBtn.classList.toggle('toggle-on', drawingEnabled);
    toggleBtn.classList.toggle('toggle-off', !drawingEnabled);
    canvas.classList.toggle('disabled', !drawingEnabled);
    canvas.style.pointerEvents = drawingEnabled ? 'auto' : 'none';
  }

  toggleBtn.addEventListener('click', () => {
    drawingEnabled = !drawingEnabled;
    setDrawingEnabled(drawingEnabled);

    updateToggleUI();

    // 👇 Tell main process to ignore mouse events
    ipcRenderer.send('toggle-drawing-mode', drawingEnabled);
  });

  // 🟢 Initial UI sync
  updateToggleUI();
}
