// Renderer process for BLCKBOLT-BROWSER
// UI: Sidebar, URL bar, webview, status bar
// TODO: Implement sidebar toggles and webview logic

document.getElementById('app').innerHTML = `
  <div class="flex h-screen">
    <aside class="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-6">
      <button id="vpn-toggle" title="VPN" class="sidebar-btn">🔒</button>
      <button id="proxy-toggle" title="Proxy" class="sidebar-btn">🌐</button>
      <button id="adblock-toggle" title="AdBlock" class="sidebar-btn">🚫</button>
      <button id="fingerprint-toggle" title="Fingerprint" class="sidebar-btn">🆔</button>
      <button id="devtools-toggle" title="DevTools" class="sidebar-btn">🛠️</button>
    </aside>
    <main class="flex-1 flex flex-col">
      <header class="flex items-center bg-gray-800 px-4 py-2">
        <button id="back-btn" class="mr-2">←</button>
        <button id="forward-btn" class="mr-2">→</button>
        <button id="reload-btn" class="mr-2">⟳</button>
        <input id="url-bar" class="flex-1 bg-gray-700 text-gray-100 px-2 py-1 rounded" placeholder="Enter URL..." />
      </header>
      <section id="webview-area" class="flex-1 bg-gray-950"></section>
      <footer class="bg-gray-800 px-4 py-2 text-xs" id="status-bar">Status: Ready</footer>
    </main>
  </div>
`;

// VPN toggle logic
let vpnEnabled = false;
const vpnToggleBtn = document.getElementById('vpn-toggle');
const statusBar = document.getElementById('status-bar');

vpnToggleBtn.addEventListener('click', () => {
  vpnEnabled = !vpnEnabled;
  if (vpnEnabled) {
    window.blckboltAPI.send('vpn-connect');
    vpnToggleBtn.classList.add('bg-green-600');
    statusBar.textContent = 'Status: VPN Connecting...';
  } else {
    window.blckboltAPI.send('vpn-disconnect');
    vpnToggleBtn.classList.remove('bg-green-600');
    statusBar.textContent = 'Status: VPN Disconnected';
  }
});

// Listen for VPN status updates from main process
window.blckboltAPI.on('vpn-status', (status) => {
  if (status === 'connected') {
    vpnToggleBtn.classList.add('bg-green-600');
    statusBar.textContent = 'Status: VPN Connected';
    vpnEnabled = true;
  } else if (status === 'disconnected') {
    vpnToggleBtn.classList.remove('bg-green-600');
    statusBar.textContent = 'Status: VPN Disconnected';
    vpnEnabled = false;
  } else if (status === 'error') {
    vpnToggleBtn.classList.remove('bg-green-600');
    statusBar.textContent = 'Status: VPN Error';
    vpnEnabled = false;
  }
});
// ...existing code...
