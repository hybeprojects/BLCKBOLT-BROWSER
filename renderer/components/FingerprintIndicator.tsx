import React, { useState, useEffect } from 'react';

interface FingerprintProfile {
  name: string;
  userAgent: string;
  platform: string;
}

const FingerprintIndicator = () => {
  const [profile, setProfile] = useState<FingerprintProfile | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStatus = async () => {
    if (!window.blckboltAPI) return
    const p = await window.blckboltAPI.invoke('fingerprint-status')
    setProfile(p)
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleRandomize = async () => {
    if (!window.blckboltAPI) return
    setLoading(true)
    const p = await window.blckboltAPI.invoke('fingerprint-randomize')
    setProfile(p)
    setLoading(false)
  }

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-4 mb-4 shadow-soft">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Fingerprint</p>
          <p className="text-xs text-slate-500">Browser profile</p>
        </div>
        <button
          className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${loading ? 'bg-slate-800 text-slate-400' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'}`}
          onClick={handleRandomize}
          disabled={loading}
        >
          {loading ? 'Randomizing...' : 'Randomize'}
        </button>
      </div>
      <div className="space-y-2 text-sm text-slate-300">
        <div className="rounded-3xl bg-slate-950/80 p-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Profile</p>
          <p className="mt-1 font-medium text-slate-100">{profile ? profile.name : 'Default'} </p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">User Agent</p>
          <p className="mt-1 text-xs text-slate-400 font-mono truncate" title={profile?.userAgent}>{profile ? profile.userAgent : 'Unknown'}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-3 text-slate-400 text-xs">
          Platform: <span className="text-slate-200">{profile ? profile.platform : '—'}</span>
        </div>
      </div>
    </div>
  )
};

export default FingerprintIndicator;
