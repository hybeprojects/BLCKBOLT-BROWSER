import React, { useState, useEffect } from 'react';

const VpnToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('disconnected');

  useEffect(() => {
    // Listen for VPN status and log events from main process
    window.blckboltAPI.on('vpn-status', (s) => setStatus(s));
    window.blckboltAPI.on('vpn-log', (log) => setLogs((prev) => [...prev, log]));
    return () => {};
  }, []);

  const handleToggle = () => {
    if (enabled) {
      window.blckboltAPI.send('vpn-disconnect');
    } else {
      window.blckboltAPI.send('vpn-connect');
    }
    setEnabled(!enabled);
  };

  return (
    <div className="p-4 bg-gray-900 rounded shadow">
      <button
        className={`px-4 py-2 rounded ${enabled ? 'bg-green-600' : 'bg-gray-700'}`}
        onClick={handleToggle}
      >
        {enabled ? 'Disconnect VPN' : 'Connect VPN'}
      </button>
      <div className="mt-2 text-xs text-gray-400">Status: {status}</div>
      <div className="mt-2 h-32 overflow-y-auto bg-black text-green-300 p-2 rounded text-xs">
        {logs.slice(-20).map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

export default VpnToggle;
