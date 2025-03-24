const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    frame: false, // Removes default title bar
    transparent: false, // Set to false for better performance
    alwaysOnTop: true, // Keeps the window on top
    webPreferences: {
      nodeIntegration: true, // Enable require() in renderer.js
      contextIsolation: false, // Allow communication with ipcRenderer
    },
  });

  mainWindow.loadFile("index.html");

  // ✅ Fix: Close the app when receiving event from renderer
  ipcMain.on("close-app", (event) => {
    console.log("Received close request from renderer process.");
    app.quit();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

// ✅ Fix: Ensure the app quits properly on all platforms except macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
