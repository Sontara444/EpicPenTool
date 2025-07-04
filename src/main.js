const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.setPath('userData', path.join(__dirname, 'electron-user-data'));
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // ✅ Safely toggle pointer behavior
  ipcMain.on('toggle-drawing-mode', (event, drawingEnabled) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (drawingEnabled) {
        mainWindow.setIgnoreMouseEvents(false);
      } else {
        mainWindow.setIgnoreMouseEvents(true, { forward: true });
      }
    }
  });
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
