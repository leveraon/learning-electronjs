const { WebContentsView, BaseWindow } = require("electron");
const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron/main");
// include the Node.js 'path' module at the top of your file
const path = require("node:path");

const createWindow = () => {
  const win = new BaseWindow({
    width: 1200,
    height: 900,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    backgroundColor: "#fff",
  });

  const view1 = new WebContentsView();
  win.contentView.addChildView(view1);
  view1.webContents.loadURL("https://google.com");
  view1.setBounds({
    x: 0,
    y: 0,
    width: 1200,
    height: 800,
  });

  win.loadFile("index.html");

  ipcMain.handle("dark-mode:toggle", () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    } else {
      nativeTheme.themeSource = "dark";
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system";
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
