// Main Electron process for BLCKBOLT-BROWSER
const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');

// Tor integration
const torManager = require('../modules/tor/torManager');
const torChecker = require('../modules/tor/torChecker');
// VPN IPC integration (advanced)
const vpn = require('../modules/network/vpn');
const proxyAgent = require('../modules/network/proxy-agent');

let mainWindow = null;
let splash = null;

// Auto-updater: prefer electron-updater when available
let updater = null;
try {
  updater = require('electron-updater').autoUpdater;
} catch (e) {
  try {
    // fallback to electron's autoUpdater if explicitly required elsewhere
    updater = require('electron').autoUpdater;
  } catch (e2) {
    updater = null;
  }
}

function getOvpnFile() {
  const vpnDir = path.join(__dirname, '../../configs/vpn');
  if (!fs.existsSync(vpnDir)) return null;
  const files = fs.readdirSync(vpnDir).filter(f => f.endsWith('.ovpn'));
  if (files.length === 0) return null;
  return path.join(vpnDir, files[0]);
}

function createWindow() {
  // Splash window
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    center: true,
    resizable: false
  });
  splash.loadFile(path.join(__dirname, '..', 'splash.html'));

  // Main window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'BLCKBOLT BROWSER – Developer Mode',
    icon: path.join(__dirname, '..', '..', 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

  // Show main window after a short delay and close splash
  setTimeout(() => {
    if (splash && !splash.isDestroyed()) splash.close();
    if (mainWindow) mainWindow.show();
  }, 3000);

  // Auto-update check
  if (updater && updater.checkForUpdatesAndNotify) {
    try { updater.checkForUpdatesAndNotify(); } catch (e) { console.warn('Updater check failed', e.message); }
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Ensure single instance (needed for protocol handling on Windows)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    // Windows: protocol url is passed in argv
    const url = argv.find(a => a && a.startsWith && a.startsWith('blckbolt://'));
    if (url && mainWindow) mainWindow.webContents.send('protocol-url', url);
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on('ready', () => {
  createWindow();
  // register protocol handler
  try { app.setAsDefaultProtocolClient('blckbolt'); } catch (e) { /* ignore */ }
});

// macOS open-url event
app.on('open-url', (event, url) => {
  event.preventDefault();
  console.log('Custom URL opened:', url);
  if (mainWindow) mainWindow.webContents.send('protocol-url', url);
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Wire up updater events if available
if (updater) {
  updater.on && updater.on('update-downloaded', () => {
    try { updater.quitAndInstall(); } catch (e) { console.error('quitAndInstall failed', e); }
  });
}

// Tor IPC handlers
ipcMain.handle('tor-enable', async (event, { profileId, socksHost = '127.0.0.1', socksPort = 9050 }) => {
  torManager.setProfileTor(profileId, { enabled: true, socksHost, socksPort });
  return torManager.getProfile(profileId);
});

ipcMain.handle('tor-disable', async (event, { profileId }) => {
  torManager.setProfileTor(profileId, { enabled: false });
  return torManager.getProfile(profileId);
});

ipcMain.handle('tor-status', async (event, { profileId }) => {
  const p = torManager.getProfile(profileId);
  const reachable = await torManager.isSocksReachable(p.socksHost, p.socksPort);
  return { ...p, reachable };
});

ipcMain.handle('tor-test', async (event, { sessionId, profileId }) => {
  const ses = session.fromPartition(sessionId);
  try {
    const ip = await torChecker.getPublicIP(ses);
    return { ip };
  } catch (e) {
    return { error: e.message };
  }
});

// VPN IPC
ipcMain.on('vpn-connect', (event, opts = {}) => {
  const configPath = getOvpnFile();
  if (!configPath) {
    event.sender.send('vpn-status', 'error');
    return;
  }
  const mode = opts.mode || 'proxy';
  const proxyPort = opts.proxyPort || 1080;
  vpn.connectWithFile(configPath, mode, proxyPort);
  if (mode === 'proxy') {
    proxyAgent.setSocksProxy(session.defaultSession, proxyPort);
  }
});

ipcMain.on('vpn-disconnect', (event) => {
  vpn.disconnect();
  proxyAgent.clearProxy(session.defaultSession);
});

// Stream VPN logs and status to renderer
vpn.on('log', (msg) => {
  if (mainWindow) mainWindow.webContents.send('vpn-log', msg);
});
vpn.on('connected', () => {
  if (mainWindow) mainWindow.webContents.send('vpn-status', 'connected');
});
vpn.on('disconnected', () => {
  if (mainWindow) mainWindow.webContents.send('vpn-status', 'disconnected');
});
vpn.on('exit', ({ code, sig }) => {
  if (mainWindow) mainWindow.webContents.send('vpn-status', 'exited');
});
