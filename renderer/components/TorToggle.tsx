import React, { useState, useEffect } from 'react';

interface TorStatus {
  enabled: boolean;
  socksHost: string;
  socksPort: number;
  reachable?: boolean;
}

const TorToggle = ({ profileId }: { profileId: string }) => {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<TorStatus | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConsent = () => setConsent(true);

  const handleToggle = async () => {
    if (!window.blckboltAPI) return;
    setLoading(true);
    if (!enabled) {
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
    if (!window.blckboltAPI) return;
    const s = await window.blckboltAPI.invoke('tor-status', { profileId });
    setStatus(s);
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line
  }, [enabled]);

  if (!consent) {
    return (
      <div className="p-4 bg-yellow-900/30 text-yellow-200 rounded shadow text-[10px] mb-4 border border-yellow-700/50">
        <b className="text-xs">Tor Integration (Opt-in):</b><br/>
        Enabling Tor will route traffic through the Tor network. Performance may decrease. <br/>
        <button className="mt-2 w-full px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded font-medium" onClick={handleConsent}>I Understand & Consent</button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 rounded shadow mb-4 border border-gray-800">
      <button
        className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${enabled ? 'bg-purple-600' : 'bg-gray-700'} ${loading ? 'opacity-50' : ''}`}
        onClick={handleToggle}
        disabled={loading}
      >
        {enabled ? 'Disable Tor' : 'Enable Tor'}
      </button>
      <div className="mt-2 text-[10px] text-gray-400">
        Status: <span className={status?.enabled ? 'text-purple-400' : ''}>{status ? (status.enabled ? 'Enabled' : 'Disabled') : 'Checking...'}</span>
      </div>
      {status && status.enabled && (
        <div className="mt-1 text-[10px] text-gray-500 font-mono">
          SOCKS: {status.socksHost}:{status.socksPort}
          {status.reachable === false && <span className="text-red-400 ml-1">(Offline)</span>}
        </div>
      )}
    </div>
  );
};

export default TorToggle;
