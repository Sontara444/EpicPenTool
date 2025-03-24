const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        frame: false, // Removes default title bar
        transparent: true, // Allows overlay effect
        alwaysOnTop: true, // Keeps window on top
        resizable: false, // Prevent resizing
        webPreferences: {
            nodeIntegration: true, // Enable IPC
            contextIsolation: false, // Allow context communication
            enableRemoteModule: false, // Security improvement
            devTools: true, // Allow debugging
        },
    });

    mainWindow.loadFile("index.html");

    // Handle window closed event
    mainWindow.on("closed", () => (mainWindow = null));
};

// 🛑 Close App
ipcMain.on("close-app", () => app.quit());

// 🎭 Toggle Click-Through Mode
ipcMain.on("toggle-click-through", (_, enabled) => {
    if (mainWindow?.isDestroyed()) return console.error("Error: mainWindow is destroyed");

    console.log("Click-through mode:", enabled);
    mainWindow.setIgnoreMouseEvents(enabled, { forward: true });
});

// 👇 Automatically disable click-through when hovering over controls
ipcMain.on("enable-ui-interaction", () => {
    if (mainWindow?.isDestroyed()) return;
    mainWindow.setIgnoreMouseEvents(false);
});

// 🚀 Initialize Electron App
app.whenReady().then(createWindow);

// ✅ Ensure app quits properly on all platforms except macOS
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
