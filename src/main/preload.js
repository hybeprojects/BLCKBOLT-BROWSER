// Preload script for secure context bridging
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('blckboltAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});
// TODO: Add secure APIs for VPN, AdBlocker, Fingerprint
