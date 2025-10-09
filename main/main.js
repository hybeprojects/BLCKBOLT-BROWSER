const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_START_URL;
let mainWindow;

function createWindow() {
  const splash = new BrowserWindow({
    width: 500,
    height: 320,
    frame: false,
    transparent: true,
    alwaysOnTop: true
  });
  // show a packaged splash if available
  try { splash.loadFile(path.join(__dirname, '..', 'renderer', 'public', 'splash.html')); } catch (e) { /* ignore */ }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '..', 'renderer', 'out', 'index.html')}`;
  mainWindow.loadURL(startUrl);

  // transition from splash to main
  setTimeout(() => {
    if (!splash.isDestroyed()) splash.close();
    mainWindow.show();
  }, 2000);

  // protocol handler example: forward urls to renderer
  ipcMain.on('protocol-opened', (event, url) => {
    mainWindow.webContents.send('protocol-url', url);
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();
  // Register protocol client
  try { app.setAsDefaultProtocolClient('blckbolt'); } catch (e) { }
});

// macOS open-url
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) mainWindow.webContents.send('protocol-url', url);
});

// single instance handling (Windows protocol urls)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    const url = argv.find(a => a && a.startsWith && a.startsWith('blckbolt://'));
    if (url && mainWindow) mainWindow.webContents.send('protocol-url', url);
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
