const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        frame: false, // Removes default title bar
        transparent: true, // Allow transparency for overlay effect
        alwaysOnTop: true, // Keeps the window on top
        resizable: false, // Prevent resizing
        webPreferences: {
            nodeIntegration: true, // Enable IPC
            contextIsolation: false, // Allow context communication
            enableRemoteModule: false, // Disable remote module for security
            devTools: true, // Allow debugging
        },
    });

    mainWindow.loadFile("index.html");

    // 🛑 Close App
    ipcMain.on("close-app", () => {
        app.quit();
    });

    ipcMain.on("toggle-click-through", (event, enabled) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        console.log("Click-through mode:", enabled);

        if (enabled) {
            mainWindow.setIgnoreMouseEvents(true, { forward: true });
        } else {
            mainWindow.setIgnoreMouseEvents(false); // Fully interactive when disabled
        }
    } else {
        console.error("Error: mainWindow is undefined or destroyed");
    }
});

// 👇 Automatically disable click-through when the user hovers over the controls
ipcMain.on("enable-ui-interaction", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setIgnoreMouseEvents(false); // Enable interaction
    }
});

  
  

    // Handle window closed event
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
