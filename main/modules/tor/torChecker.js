// src/modules/tor/torChecker.js
const net = require('net');
const https = require('https');

async function isSocksReachable(socksHost, socksPort, timeout = 2000) {
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

async function getPublicIP(session) {
  // Use Electron session to make proxied request
  return new Promise((resolve, reject) => {
    session.resolveProxy('https://api.ipify.org', (proxy) => {
      const agent = proxy.includes('socks5') ? require('socks-proxy-agent')(proxy) : undefined;
      https.get({
        hostname: 'api.ipify.org',
        path: '/?format=json',
        agent,
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const ip = JSON.parse(data).ip;
            resolve(ip);
          } catch (e) { reject(e); }
        });
      }).on('error', reject);
    });
  });
}

module.exports = { isSocksReachable, getPublicIP };
