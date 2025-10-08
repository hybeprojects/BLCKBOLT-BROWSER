// src/preload/tor-safe.js
// Minimal runtime checks for Tor integration (optional)
window.addEventListener('DOMContentLoaded', () => {
  // Example: warn if not running on localhost
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.warn('Tor integration is only supported for localhost connections.');
  }
});
