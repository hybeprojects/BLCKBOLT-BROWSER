import React, { useState, useEffect } from 'react';

const FingerprintIndicator = () => {
  const [profile, setProfile] = useState('default');
  const [randomized, setRandomized] = useState(false);
  const [status, setStatus] = useState('shielded');

  useEffect(() => {
    // TODO: Listen for fingerprint status/profile from main process (stub)
    // window.blckboltAPI.on('fingerprint-status', (s) => setStatus(s));
    // window.blckboltAPI.on('fingerprint-profile', (p) => setProfile(p));
  }, []);

  const handleRandomize = () => {
    setRandomized(true);
    setStatus('randomized');
    // TODO: Send IPC to randomize fingerprint (stub)
    // window.blckboltAPI.send('fingerprint-randomize');
  };

  return (
    <div className="p-4 bg-gray-900 rounded shadow flex flex-col items-start">
      <div className="flex items-center mb-2">
        <span className={`w-3 h-3 rounded-full mr-2 ${status === 'shielded' ? 'bg-green-600' : 'bg-yellow-500'}`}></span>
        <span className="text-xs text-gray-200">Fingerprint: <b>{status === 'shielded' ? 'Shielded' : 'Randomized'}</b></span>
      </div>
      <div className="text-xs text-gray-400 mb-2">Profile: {profile}</div>
      <button className="px-3 py-1 bg-blue-700 rounded text-xs" onClick={handleRandomize}>
        Randomize
      </button>
    </div>
  );
};

export default FingerprintIndicator;
