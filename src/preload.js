const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("close-app"),
  minimizeApp: () => ipcRenderer.send("minimize-app"),
  maximizeApp: () => ipcRenderer.send("maximize-app"),
  toggleClickThrough: () => ipcRenderer.send("toggle-click-through"),
  toggleDrawingMode: (enabled) => ipcRenderer.send("toggle-drawing-mode", enabled),
  onToggleDrawingShortcut: (callback) => ipcRenderer.on('shortcut-toggle-drawing', () => callback()),
  storeGet: (key) => ipcRenderer.invoke('store-get', key),
  storeSet: (key, val) => ipcRenderer.invoke('store-set', key, val),
});
