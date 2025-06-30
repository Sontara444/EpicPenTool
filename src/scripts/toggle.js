// toggle.js
const { ipcRenderer } = require('electron');

let internalDrawingEnabled = true;

export function setupToggleDrawing(toggleBtn, canvas, setDrawingEnabled) {
  function updateToggleUI() {
    toggleBtn.classList.toggle('toggle-on', internalDrawingEnabled);
    toggleBtn.classList.toggle('toggle-off', !internalDrawingEnabled);
    canvas.classList.toggle('disabled', !internalDrawingEnabled);
    canvas.style.pointerEvents = internalDrawingEnabled ? 'auto' : 'none';
  }

  toggleBtn.addEventListener('click', () => {
    internalDrawingEnabled = !internalDrawingEnabled;
    setDrawingEnabled(internalDrawingEnabled);
    updateToggleUI();
    ipcRenderer.send('toggle-drawing-mode', internalDrawingEnabled);
  });

  // Default at startup
  internalDrawingEnabled = true;
  setDrawingEnabled(true);
  updateToggleUI();
}

// Function to programmatically turn the toggle OFF
export function disableDrawingExternally(toggleBtn, canvas, setDrawingEnabled) {
  internalDrawingEnabled = false;
  setDrawingEnabled(false);
  toggleBtn.classList.remove('toggle-on');
  toggleBtn.classList.add('toggle-off');
  canvas.classList.add('disabled');
  canvas.style.pointerEvents = 'none';
  ipcRenderer.send('toggle-drawing-mode', false);
}
