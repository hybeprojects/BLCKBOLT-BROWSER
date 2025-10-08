import React, { useState } from 'react';

const TorStatusPanel = ({ profileId }) => {
  const [ip, setIp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkTorIp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.blckboltAPI.invoke('tor-test', { sessionId: `persist:${profileId}`, profileId });
      if (res.ip) setIp(res.ip);
      else setError(res.error || 'Unknown error');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-900 rounded shadow mt-2">
      <div className="text-xs text-gray-400 mb-2">Tor Diagnostics</div>
      <button className="px-3 py-1 bg-blue-700 rounded text-xs" onClick={checkTorIp} disabled={loading}>
        {loading ? 'Checking...' : 'Check Tor IP'}
      </button>
      {ip && <div className="mt-2 text-green-400 text-xs">Tor IP: {ip}</div>}
      {error && <div className="mt-2 text-red-400 text-xs">Error: {error}</div>}
    </div>
  );
};

export default TorStatusPanel;
