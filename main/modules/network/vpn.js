// vpn.js - VPN integration module for BLCKBOLT-BROWSER
// Accepts OpenVPN .ovpn configs, manages connection via CLI
// Placeholder: implement OpenVPN child_process logic here
// TODO: Add IPC handlers and system permission checks


const { spawn } = require('child_process');
const fs = require('fs');
const EventEmitter = require('events');
class VpnManager extends EventEmitter {
  constructor() {
    super();
    this.proc = null;
    this.mode = null; // "system" or "proxy"
  }

  connectWithFile(ovpnPath, mode = 'proxy', proxyPort = 1080) {
    if (!fs.existsSync(ovpnPath)) throw new Error('ovpn missing');
    this.mode = mode;
    if (mode === 'system') {
      this._startSystemOpenVPN(ovpnPath);
    } else {
      // Launch openvpn with --management or spawn a helper that creates SOCKS proxy (see README)
      this._startOpenVPNProxy(ovpnPath, proxyPort);
    }
  }

  _startSystemOpenVPN(ovpnPath) {
    this.proc = spawn('openvpn', ['--config', ovpnPath]);
    this._wireProcess();
  }

  _startOpenVPNProxy(ovpnPath, proxyPort) {
    // Example pattern: run openvpn --config file --dev tunX,
    // then run dante/socks server bound to tun or local mapping.
    // For quick dev: assume user runs container that exposes socks:1080
    // We'll attempt to run a helper script that sets up redsocks/dante
    this.proc = spawn('bash', ['-c', `openvpn --config ${ovpnPath}`], { detached: true });
    this._wireProcess();
    // Note: You must instruct user to run a tiny container combining openvpn + dante for browser-only mode.
  }

  _wireProcess() {
    if (!this.proc) return;
    this.proc.stdout.on('data', d => this.emit('log', d.toString()));
    this.proc.stderr.on('data', d => this.emit('log', d.toString()));
    this.proc.on('exit', (code, sig) => {
      this.emit('exit', { code, sig });
      this.proc = null;
    });
    this.emit('connected');
  }

  disconnect() {
    if (this.proc) {
      try { process.kill(-this.proc.pid); } catch(e) { this.proc.kill(); }
      this.proc = null;
      this.emit('disconnected');
    }
  }

  status() {
    return { running: !!this.proc, mode: this.mode };
  }
}

module.exports = new VpnManager();
