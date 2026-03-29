import React, { useState, useEffect } from 'react';

interface TorStatus {
  enabled: boolean;
  socksHost: string;
  socksPort: number;
  reachable?: boolean;
}

const TorToggle = ({ profileId }: { profileId: string }) => {
  const [enabled, setEnabled] = useState(false)
  const [status, setStatus] = useState<TorStatus | null>(null)
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConsent = () => setConsent(true)

  const handleToggle = async () => {
    if (!window.blckboltAPI) return
    setLoading(true)
    if (!enabled) {
      await window.blckboltAPI.invoke('tor-enable', { profileId })
      setEnabled(true)
    } else {
      await window.blckboltAPI.invoke('tor-disable', { profileId })
      setEnabled(false)
    }
    setLoading(false)
    fetchStatus()
  }

  const fetchStatus = async () => {
    if (!window.blckboltAPI) return
    const s = await window.blckboltAPI.invoke('tor-status', { profileId })
    setStatus(s)
  }

  useEffect(() => {
    fetchStatus()
    // eslint-disable-next-line
  }, [enabled])

  if (!consent) {
    return (
      <div className="glass-panel rounded-3xl border border-amber-500/20 bg-amber-950/15 p-4 text-amber-200 shadow-soft mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em]">Tor Integration</p>
        <p className="mt-3 text-sm leading-6 text-amber-100/80">
          Enabling Tor will route traffic through the Tor network with extra privacy protection. Performance may vary.
        </p>
        <button
          className="mt-4 w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          onClick={handleConsent}
        >
          I Understand & Consent
        </button>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-4 mb-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Tor</p>
          <p className="text-xs text-slate-500">Hidden route management</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${enabled ? 'bg-violet-500/15 text-violet-300' : 'bg-slate-800 text-slate-400'}`}>
          {status?.enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      <button
        className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${enabled ? 'bg-violet-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'} ${loading ? 'opacity-60' : ''}`}
        onClick={handleToggle}
        disabled={loading}
      >
        {enabled ? 'Disable Tor' : 'Enable Tor'}
      </button>
      <div className="mt-3 text-sm text-slate-400">
        Status: <span className={status?.enabled ? 'text-violet-300' : 'text-slate-500'}>{status ? (status.enabled ? 'Enabled' : 'Checking...') : 'Checking...'}</span>
      </div>
      {status && status.enabled && (
        <div className="mt-2 rounded-3xl bg-slate-950/80 p-3 text-xs text-slate-400 font-mono">
          <p>SOCKS: {status.socksHost}:{status.socksPort}</p>
          {status.reachable === false && <p className="text-red-400">Offline</p>}
        </div>
      )}
    </div>
  )
};

export default TorToggle;
