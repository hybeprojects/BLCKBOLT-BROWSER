// Preload script for secure context bridging
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('blckboltAPI', {
  send: (channel, data) => {
    // Only allow specific channels for security
    const validChannels = ['vpn-connect', 'vpn-disconnect'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    const validChannels = ['vpn-status'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
// TODO: Add secure APIs for AdBlocker, Fingerprint
