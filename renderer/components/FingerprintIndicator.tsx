import React, { useState, useEffect } from 'react';

interface FingerprintProfile {
  name: string;
  userAgent: string;
  platform: string;
}

const FingerprintIndicator = () => {
  const [profile, setProfile] = useState<FingerprintProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    if (!window.blckboltAPI) return;
    const p = await window.blckboltAPI.invoke('fingerprint-status');
    setProfile(p);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRandomize = async () => {
    if (!window.blckboltAPI) return;
    setLoading(true);
    const p = await window.blckboltAPI.invoke('fingerprint-randomize');
    setProfile(p);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-900 rounded shadow mb-4 border border-gray-800">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Profile</span>
        <button
          className={`px-2 py-1 rounded text-[10px] font-medium bg-blue-600 hover:bg-blue-500 transition-colors ${loading ? 'opacity-50' : ''}`}
          onClick={handleRandomize}
          disabled={loading}
        >
          {loading ? '...' : 'Randomize'}
        </button>
      </div>
      <div className="text-xs font-medium text-blue-400 mb-1">
        {profile ? profile.name : 'Unknown Profile'}
      </div>
      {profile && (
        <div className="text-[10px] text-gray-500 font-mono truncate" title={profile.userAgent}>
          UA: {profile.userAgent.substring(0, 30)}...
        </div>
      )}
      <div className="mt-1 text-[10px] text-gray-600">
        Platform: {profile ? profile.platform : '---'}
      </div>
    </div>
  );
};

export default FingerprintIndicator;
