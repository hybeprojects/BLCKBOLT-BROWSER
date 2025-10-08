// Tor integration
const torManager = require('../modules/tor/torManager');
const torChecker = require('../modules/tor/torChecker');

// Enable Tor for a profile
ipcMain.handle('tor-enable', async (event, { profileId, socksHost = '127.0.0.1', socksPort = 9050 }) => {
  torManager.setProfileTor(profileId, { enabled: true, socksHost, socksPort });
  // Optionally apply proxy to session if you have a session object for this profile
  // await torManager.applyProxyToSession(sessionObj, profileId);
  return torManager.getProfile(profileId);
});

// Disable Tor for a profile
ipcMain.handle('tor-disable', async (event, { profileId }) => {
  torManager.setProfileTor(profileId, { enabled: false });
  // Optionally clear proxy for session
  // await torManager.applyProxyToSession(sessionObj, profileId);
  return torManager.getProfile(profileId);
});

// Get Tor status for a profile
ipcMain.handle('tor-status', async (event, { profileId }) => {
  const p = torManager.getProfile(profileId);
  const reachable = await torManager.isSocksReachable(p.socksHost, p.socksPort);
  return { ...p, reachable };
});

// Test Tor IP for a profile (calls out via proxied session)
ipcMain.handle('tor-test', async (event, { sessionId, profileId }) => {
  // sessionId: Electron session partition name (e.g., 'persist:profileA')
  const ses = session.fromPartition(sessionId);
  try {
    const ip = await torChecker.getPublicIP(ses);
    return { ip };
  } catch (e) {
    return { error: e.message };
  }
});
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
