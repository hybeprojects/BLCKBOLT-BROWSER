const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

function initAutoUpdater(mainWindow) {
  autoUpdater.on('update-available', () => {
    if (mainWindow) mainWindow.webContents.send('update-available');
  });

  autoUpdater.on('update-downloaded', () => {
    const res = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      buttons: ['Install and Restart', 'Later'],
      title: 'Update Ready',
      message: 'An update has been downloaded. Install now?'
    });
    if (res === 0) autoUpdater.quitAndInstall();
  });

  autoUpdater.checkForUpdatesAndNotify().catch(()=>{});
}

module.exports = { initAutoUpdater };
