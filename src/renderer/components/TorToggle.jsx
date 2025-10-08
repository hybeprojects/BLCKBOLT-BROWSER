import React, { useState } from 'react';

const TorToggle = ({ profileId }) => {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConsent = () => setConsent(true);

  const handleToggle = async () => {
    setLoading(true);
    if (!enabled) {
      // Enable Tor for this profile
      await window.blckboltAPI.invoke('tor-enable', { profileId });
      setEnabled(true);
    } else {
      await window.blckboltAPI.invoke('tor-disable', { profileId });
      setEnabled(false);
    }
    setLoading(false);
    fetchStatus();
  };

  const fetchStatus = async () => {
    const s = await window.blckboltAPI.invoke('tor-status', { profileId });
    setStatus(s);
  };

  React.useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line
  }, [enabled]);

  if (!consent) {
    return (
      <div className="p-4 bg-yellow-900 text-yellow-200 rounded shadow text-xs">
        <b>Tor Integration (Opt-in):</b><br/>
        Enabling Tor will route this profile's traffic through the Tor network. Performance may decrease. Use only for legal, ethical research. <br/>
        <button className="mt-2 px-3 py-1 bg-yellow-700 rounded" onClick={handleConsent}>I Understand & Consent</button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 rounded shadow">
      <button
        className={`px-4 py-2 rounded ${enabled ? 'bg-green-600' : 'bg-gray-700'} ${loading ? 'opacity-50' : ''}`}
        onClick={handleToggle}
        disabled={loading}
      >
        {enabled ? 'Disable Tor' : 'Enable Tor'}
      </button>
      <div className="mt-2 text-xs text-gray-400">Status: {status ? (status.enabled ? 'Enabled' : 'Disabled') : 'Checking...'}</div>
      <div className="mt-1 text-xs text-gray-400">SOCKS: {status ? `${status.socksHost}:${status.socksPort}` : ''} {status && status.reachable === false && <span className="text-red-400">(Not Reachable)</span>}</div>
    </div>
  );
};

export default TorToggle;
