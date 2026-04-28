const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');

let store;

ipcMain.handle('store-get', (event, key) => {
  if (store) return store.get(key);
  return null;
});

ipcMain.handle('store-set', (event, key, val) => {
  if (store) store.set(key, val);
});

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
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Aggressively force the window to stay on top of EVERYTHING (including taskbar and fullscreen apps)
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

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

app.whenReady().then(async () => {
  const { default: Store } = await import('electron-store');
  store = new Store();
  
  createWindow();

  globalShortcut.register('CommandOrControl+Shift+D', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('shortcut-toggle-drawing');
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
