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

// VPN IPC handlers
const vpn = require('../modules/network/vpn');
let vpnProcess = null;

ipcMain.on('vpn-connect', (event) => {
  // Example: use first .ovpn file in configs/vpn/
  const fs = require('fs');
  const vpnDir = path.join(__dirname, '../../configs/vpn');
  const files = fs.readdirSync(vpnDir).filter(f => f.endsWith('.ovpn'));
  if (files.length === 0) {
    event.sender.send('vpn-status', 'error');
    return;
  }
  const configPath = path.join(vpnDir, files[0]);
  vpn.connect(configPath, (status) => {
    event.sender.send('vpn-status', status);
  });
});

ipcMain.on('vpn-disconnect', (event) => {
  vpn.disconnect((status) => {
    event.sender.send('vpn-status', status);
  });
});
