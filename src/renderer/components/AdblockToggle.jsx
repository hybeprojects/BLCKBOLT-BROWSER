import React, { useState, useEffect } from 'react';

const AdblockToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [blocked, setBlocked] = useState(0);
  const [status, setStatus] = useState('disabled');

  useEffect(() => {
    // TODO: Listen for adblock status/stats from main process (stub)
    // window.blckboltAPI.on('adblock-status', (s) => setStatus(s));
    // window.blckboltAPI.on('adblock-blocked', (n) => setBlocked(n));
  }, []);

  const handleToggle = () => {
    setEnabled(!enabled);
    setStatus(!enabled ? 'enabled' : 'disabled');
    // TODO: Send IPC to main process to enable/disable adblock (stub)
    // window.blckboltAPI.send('adblock-toggle', { enabled: !enabled });
  };

  return (
    <div className="p-4 bg-gray-900 rounded shadow">
      <button
        className={`px-4 py-2 rounded ${enabled ? 'bg-green-600' : 'bg-gray-700'}`}
        onClick={handleToggle}
      >
        {enabled ? 'Disable Adblock' : 'Enable Adblock'}
      </button>
      <div className="mt-2 text-xs text-gray-400">Status: {status}</div>
      <div className="mt-2 text-xs text-gray-400">Blocked: {blocked} ads</div>
    </div>
  );
};

export default AdblockToggle;
