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
    const validChannels = ['vpn-status', 'vpn-log', 'protocol-url'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  invoke: (channel, data) => {
    // Tor and other IPC methods
    const validInvoke = [
      'tor-enable', 'tor-disable', 'tor-status', 'tor-test',
      'adblock-enable', 'adblock-disable', 'adblock-status',
      'fingerprint-randomize', 'fingerprint-status', 'fingerprint-set'
    ];
    if (validInvoke.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  }
});
