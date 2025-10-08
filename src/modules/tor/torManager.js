// src/modules/tor/torManager.js
const net = require('net');

class TorManager {
  constructor() {
    this.profiles = {}; // {profileId: {enabled:bool, socksHost:'127.0.0.1', socksPort:9050}}
  }

  setProfileTor(profileId, opts = {}) {
    const { enabled = true, socksHost = '127.0.0.1', socksPort = 9050 } = opts;
    this.profiles[profileId] = { enabled, socksHost, socksPort };
  }

  getProfile(profileId) {
    return this.profiles[profileId] || { enabled:false, socksHost:'127.0.0.1', socksPort:9050 };
  }

  async isSocksReachable(socksHost, socksPort, timeout = 2000) {
    return new Promise((resolve) => {
      const s = new net.Socket();
      let done = false;
      s.setTimeout(timeout);
      s.on('connect', () => { done = true; s.destroy(); resolve(true); });
      s.on('error', () => { if (!done) { done = true; resolve(false); }});
      s.on('timeout', () => { if (!done) { done = true; s.destroy(); resolve(false); }});
      s.connect(socksPort, socksHost);
    });
  }

  // This applies proxy to a session (BrowserView.webContents.session)
  async applyProxyToSession(sessionObj, profileId) {
    const p = this.getProfile(profileId);
    if (!p.enabled) {
      await sessionObj.setProxy({ mode: 'direct' });
      return;
    }
    const proxy = `socks5://${p.socksHost}:${p.socksPort}`;
    await sessionObj.setProxy({ proxyRules: proxy });
  }
}

module.exports = new TorManager();
