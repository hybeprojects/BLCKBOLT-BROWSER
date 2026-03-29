// Main Electron process for BLCKBOLT-BROWSER
const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');

// Privacy Modules
const torManager = require('./modules/tor/torManager');
const torChecker = require('./modules/tor/torChecker');
const vpn = require('./modules/network/vpn');
const proxyAgent = require('./modules/network/proxy-agent');
const adblocker = require('./modules/adblocker');
const fingerprint = require('./modules/fingerprint');
const dohDot = require('./modules/network/doh-dot');
const canvasBlocker = require('./modules/fingerprint/canvas-blocker');
const dpiDetector = require('./modules/network/dpi-detector');

let mainWindow = null;
let splash = null;

const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_START_URL;

// Auto-updater
let updater = null;
try {
  updater = require('electron-updater').autoUpdater;
} catch (e) {
  try {
    updater = require('electron').autoUpdater;
  } catch (e2) {
    updater = null;
  }
}

function getOvpnFile() {
  const vpnDir = path.join(__dirname, '../configs/vpn');
  if (!fs.existsSync(vpnDir)) return null;
  const files = fs.readdirSync(vpnDir).filter(f => f.endsWith('.ovpn'));
  if (files.length === 0) return null;
  return path.join(vpnDir, files[0]);
}

function createWindow() {
  // Splash window
  splash = new BrowserWindow({
    width: 500,
    height: 320,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    center: true,
    resizable: false
  });
  const splashPath = path.join(__dirname, 'splash.html');
  if (fs.existsSync(splashPath)) {
    splash.loadFile(splashPath);
  }

  // Main window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    title: 'BLCKBOLT BROWSER – Developer Mode',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webRtcIPHandlingPolicy: 'disable_non_proxied_udp'
    }
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '..', 'renderer', 'out', 'index.html')}`;
  mainWindow.loadURL(startUrl);

  // Transition from splash to main
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

// Single instance handling
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

app.on('ready', () => {
  createWindow();
  try { app.setAsDefaultProtocolClient('blckbolt'); } catch (e) { }
});

app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) mainWindow.webContents.send('protocol-url', url);
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Wire up updater
if (updater) {
  updater.on && updater.on('update-downloaded', () => {
    try { updater.quitAndInstall(); } catch (e) { console.error('quitAndInstall failed', e); }
  });
}

// IPC Handlers: Tor
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

// IPC Handlers: VPN
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

vpn.on('log', (msg) => { if (mainWindow) mainWindow.webContents.send('vpn-log', msg); });
vpn.on('connected', () => { if (mainWindow) mainWindow.webContents.send('vpn-status', 'connected'); });
vpn.on('disconnected', () => { if (mainWindow) mainWindow.webContents.send('vpn-status', 'disconnected'); });

// IPC Handlers: AdBlocker
ipcMain.handle('adblock-enable', () => {
  adblocker.enable(session.defaultSession);
  return { enabled: true };
});

ipcMain.handle('adblock-disable', () => {
  adblocker.disable(session.defaultSession);
  return { enabled: false };
});

ipcMain.handle('adblock-status', () => {
  return { enabled: adblocker.enabled, blockedCount: adblocker.getBlockedCount() };
});

// IPC Handlers: Fingerprint
ipcMain.handle('fingerprint-randomize', () => {
  const p = fingerprint.randomize();
  fingerprint.applyToSession(session.defaultSession);
  return p;
});

ipcMain.handle('fingerprint-status', () => {
  return fingerprint.getCurrent();
});

ipcMain.handle('fingerprint-set', (event, index) => {
  fingerprint.setProfile(index);
  fingerprint.applyToSession(session.defaultSession);
  return fingerprint.getCurrent();
});

// IPC Handlers: WebRTC Leak Detection & Prevention
ipcMain.handle('webrtc-test', async () => {
  // Test if WebRTC leaks local IPs
  // Returns: { protected: boolean, ipAddresses: string[] }
  try {
    if (!mainWindow) return { protected: true, ipAddresses: [] };
    
    // Inject script to detect WebRTC IP leaks
    const result = await mainWindow.webContents.executeJavaScript(`
      (async () => {
        const peerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        if (!peerConnection) return { protected: true, ipAddresses: [] };
        
        const ips = [];
        const pc = new peerConnection({ iceServers: [] });
        
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            pc.close();
            resolve({ protected: ips.length === 0, ipAddresses: ips });
          }, 2000);
          
          pc.onicecandidate = (ice) => {
            if (!ice || !ice.candidate) return;
            const ipRegex = /([0-9]{1,3}(\\.[0-9]{1,3}){3})/;
            const match = ice.candidate.candidate.match(ipRegex);
            if (match && !match[1].startsWith('127.')) {
              ips.push(match[1]);
            }
          };
          
          pc.createDataChannel('test');
          pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(() => {});
        });
      })()
    `);
    
    return result || { protected: true, ipAddresses: [] };
  } catch (e) {
    console.warn('WebRTC test error:', e.message);
    return { protected: true, ipAddresses: [] };
  }
});

ipcMain.handle('webrtc-status', () => {
  return {
    blocked: true,
    policy: 'disable_non_proxied_udp',
    timestamp: new Date().toISOString()
  };
});

// IPC Handlers: DoH/DoT (DNS over HTTPS/TLS)
ipcMain.handle('doh-get-resolvers', () => {
  return dohDot.getResolvers();
});

ipcMain.handle('doh-get-current', () => {
  return dohDot.getCurrentResolver();
});

ipcMain.handle('doh-set-resolver', (event, { resolverId, dohEnabled, dotEnabled }) => {
  const result = dohDot.setResolver(resolverId, { dohEnabled, dotEnabled });
  if (mainWindow) {
    dohDot.applyToSession(session.defaultSession);
    mainWindow.webContents.send('doh-updated', result);
  }
  return result;
});

ipcMain.handle('doh-test-resolver', async (event, resolverId) => {
  return await dohDot.testResolver(resolverId);
});

ipcMain.handle('doh-status', () => {
  return dohDot.getStatus();
});

// IPC Handlers: Canvas Fingerprinting Blocker
ipcMain.handle('canvas-blocker-enable', () => {
  canvasBlocker.isEnabled = true;
  return { enabled: true };
});

ipcMain.handle('canvas-blocker-disable', () => {
  canvasBlocker.isEnabled = false;
  return { enabled: false };
});

ipcMain.handle('canvas-blocker-status', () => {
  return {
    enabled: canvasBlocker.isEnabled,
    timestamp: new Date().toISOString()
  };
});

// IPC Handlers: DPI Detection
ipcMain.handle('dpi-detector-start', async () => {
  const results = await dpiDetector.runDetectionScan();
  if (mainWindow) {
    mainWindow.webContents.send('dpi-results', results);
  }
  return results;
});

ipcMain.handle('dpi-detector-status', () => {
  return dpiDetector.getStatus();
});

ipcMain.handle('dpi-detector-recommendations', () => {
  return dpiDetector.getRecommendations();
});
