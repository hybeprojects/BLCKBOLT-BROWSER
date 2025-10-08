// Main Electron process for BLCKBOLT-BROWSER
const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'BLCKBOLT BROWSER – Developer Mode',
    icon: path.join(__dirname, '../assets/icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });
  win.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// VPN IPC integration (advanced)
const vpn = require('../modules/network/vpn');
const proxyAgent = require('../modules/network/proxy-agent');
let mainWindow = null;

function getOvpnFile() {
  const fs = require('fs');
  const vpnDir = path.join(__dirname, '../../configs/vpn');
  const files = fs.readdirSync(vpnDir).filter(f => f.endsWith('.ovpn'));
  if (files.length === 0) return null;
  return path.join(vpnDir, files[0]);
}

app.whenReady().then(() => {
  mainWindow = BrowserWindow.getAllWindows()[0];
  // ...existing code...
});

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
