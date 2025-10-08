// vpn.js - VPN integration module for BLCKBOLT-BROWSER
// Accepts OpenVPN .ovpn configs, manages connection via CLI
// Placeholder: implement OpenVPN child_process logic here
// TODO: Add IPC handlers and system permission checks

const { spawn } = require('child_process');
let openvpnProcess = null;

module.exports = {
  connect: (configPath, statusCallback) => {
    if (openvpnProcess) {
      statusCallback && statusCallback('connected');
      return;
    }
    openvpnProcess = spawn('openvpn', ['--config', configPath]);
    let connected = false;
    openvpnProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (!connected && output.includes('Initialization Sequence Completed')) {
        connected = true;
        statusCallback && statusCallback('connected');
      }
    });
    openvpnProcess.stderr.on('data', (data) => {
      statusCallback && statusCallback('error');
    });
    openvpnProcess.on('exit', (code) => {
      openvpnProcess = null;
      statusCallback && statusCallback('disconnected');
    });
  },
  disconnect: (statusCallback) => {
    if (openvpnProcess) {
      openvpnProcess.kill('SIGTERM');
      openvpnProcess = null;
      statusCallback && statusCallback('disconnected');
    } else {
      statusCallback && statusCallback('disconnected');
    }
  },
  status: () => {
    return openvpnProcess ? 'connected' : 'disconnected';
  }
};
