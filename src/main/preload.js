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
    const validChannels = ['vpn-status', 'vpn-log'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  invoke: (channel, data) => {
    // Tor IPC methods
    const validInvoke = ['tor-enable', 'tor-disable', 'tor-status', 'tor-test'];
    if (validInvoke.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  }
});
// Expose a specific API to listen for protocol URLs in a safe way
contextBridge.exposeInMainWorld('blckboltProtocol', {
  onProtocolUrl: (fn) => {
    ipcRenderer.on('protocol-url', (event, url) => fn(url));
  }
});
// TODO: Add secure APIs for AdBlocker, Fingerprint
