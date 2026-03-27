import React, { useState, useEffect } from 'react';

const AdblockToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);

  const fetchStatus = async () => {
    if (!window.blckboltAPI) return;
    const s = await window.blckboltAPI.invoke('adblock-status');
    setEnabled(s.enabled);
    setBlockedCount(s.blockedCount);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    if (!window.blckboltAPI) return;
    if (enabled) {
      await window.blckboltAPI.invoke('adblock-disable');
    } else {
      await window.blckboltAPI.invoke('adblock-enable');
    }
    fetchStatus();
  };

  return (
    <div className="p-4 bg-gray-900 rounded shadow mb-4 border border-gray-800">
      <button
        className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${enabled ? 'bg-red-600' : 'bg-gray-700'}`}
        onClick={handleToggle}
      >
        {enabled ? 'Disable AdBlock' : 'Enable AdBlock'}
      </button>
      <div className="mt-2 text-[10px] text-gray-400">
        Status: <span className={enabled ? 'text-red-400' : ''}>{enabled ? 'Active' : 'Disabled'}</span>
      </div>
      {enabled && (
        <div className="mt-1 text-[10px] text-gray-500">
          Blocked: <span className="font-mono text-white">{blockedCount}</span> requests
        </div>
      )}
    </div>
  );
};

export default AdblockToggle;
