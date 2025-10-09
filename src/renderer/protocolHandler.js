// Protocol URL handler for renderer
function initProtocolHandler() {
  if (window.blckboltProtocol && typeof window.blckboltProtocol.onProtocolUrl === 'function') {
    window.blckboltProtocol.onProtocolUrl((url) => {
      const el = document.getElementById('protocol-url');
      if (el) el.textContent = url;
      // Optionally, dispatch a custom event for React components
      window.dispatchEvent(new CustomEvent('blckbolt-protocol', { detail: { url } }));
    });
  }
}

export default initProtocolHandler;
