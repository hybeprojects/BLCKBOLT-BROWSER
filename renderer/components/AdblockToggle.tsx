import React, { useState, useEffect } from 'react';

const AdblockToggle = () => {
  const [enabled, setEnabled] = useState(false)
  const [blockedCount, setBlockedCount] = useState(0)

  const fetchStatus = async () => {
    if (!window.blckboltAPI) return
    const s = await window.blckboltAPI.invoke('adblock-status')
    setEnabled(s.enabled)
    setBlockedCount(s.blockedCount)
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleToggle = async () => {
    if (!window.blckboltAPI) return
    if (enabled) {
      await window.blckboltAPI.invoke('adblock-disable')
    } else {
      await window.blckboltAPI.invoke('adblock-enable')
    }
    fetchStatus()
  }

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-4 mb-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">AdBlock</p>
          <p className="text-xs text-slate-500">Filter unwanted content</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${enabled ? 'bg-red-500/15 text-red-300' : 'bg-slate-800 text-slate-400'}`}>
          {enabled ? 'Active' : 'Disabled'}
        </span>
      </div>
      <button
        className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${enabled ? 'bg-red-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
        onClick={handleToggle}
      >
        {enabled ? 'Disable AdBlock' : 'Enable AdBlock'}
      </button>
      {enabled && (
        <div className="mt-3 rounded-3xl bg-slate-950/80 p-3 text-sm text-slate-300">
          Blocked: <span className="font-semibold text-slate-100">{blockedCount}</span> requests
        </div>
      )}
    </div>
  )
};

export default AdblockToggle;
