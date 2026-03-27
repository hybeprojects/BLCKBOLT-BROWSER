import React, { useState, useEffect } from 'react';

const VpnToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('disconnected');

  useEffect(() => {
    if (window.blckboltAPI) {
      window.blckboltAPI.on('vpn-status', (s: string) => setStatus(s));
      window.blckboltAPI.on('vpn-log', (log: string) => setLogs((prev) => [...prev, log]));
    }
  }, []);

  const handleToggle = () => {
    if (!window.blckboltAPI) return;
    if (enabled) {
      window.blckboltAPI.send('vpn-disconnect');
    } else {
      window.blckboltAPI.send('vpn-connect');
    }
    setEnabled(!enabled);
  };

  return (
    <div className="p-4 bg-gray-900 rounded shadow mb-4">
      <button
        className={`w-full px-4 py-2 rounded text-sm font-medium ${enabled ? 'bg-green-600' : 'bg-gray-700'}`}
        onClick={handleToggle}
      >
        {enabled ? 'Disconnect VPN' : 'Connect VPN'}
      </button>
      <div className="mt-2 text-[10px] text-gray-400">Status: {status}</div>
      {logs.length > 0 && (
        <div className="mt-2 h-24 overflow-y-auto bg-black text-green-400 p-2 rounded text-[10px] font-mono">
          {logs.slice(-10).map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}
    </div>
  );
};

export default VpnToggle;
