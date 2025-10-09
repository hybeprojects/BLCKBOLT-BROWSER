const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('blckbolt', {
  openTab: (url) => ipcRenderer.send('open-tab', url),
  closeTab: (id) => ipcRenderer.send('close-tab', id),
  onProtocolUrl: (fn) => ipcRenderer.on('protocol-url', (event, url) => fn(url)),
  onUpdateAvailable: (fn) => ipcRenderer.on('update-available', fn)
});
