import React from 'react'
import VpnToggle from './VpnToggle'
import TorToggle from './TorToggle'
import AdblockToggle from './AdblockToggle'
import FingerprintIndicator from './FingerprintIndicator'

export default function SidePanel() {
  return (
    <aside className="hidden md:block w-full max-w-xs shrink-0">
      <div className="glass-panel rounded-3xl border border-white/10 p-5 mb-4 shadow-soft custom-scrollbar overflow-y-auto max-h-[calc(100vh-140px)]">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-2">Privacy Overview</p>
          <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
              <span>Network protection</span>
              <span className="text-accent">Active</span>
            </div>
            <div className="mt-3 grid gap-3 text-sm text-slate-400">
              <div className="rounded-2xl bg-slate-900/80 p-3">Tor: <span className="font-medium text-slate-100">Ready</span></div>
              <div className="rounded-2xl bg-slate-900/80 p-3">Adblock: <span className="font-medium text-slate-100">Enabled</span></div>
              <div className="rounded-2xl bg-slate-900/80 p-3">Fingerprint: <span className="font-medium text-slate-100">Randomized</span></div>
            </div>
          </div>
        </div>

        <VpnToggle />
        <AdblockToggle />
        <TorToggle profileId="default" />
        <FingerprintIndicator />
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 p-5 shadow-soft">
        <h3 className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-4">Quick Actions</h3>
        <div className="grid gap-3 text-sm text-slate-300">
          <button className="w-full rounded-2xl bg-slate-900/90 px-4 py-3 text-left transition hover:bg-slate-800">Open Privacy Report</button>
          <button className="w-full rounded-2xl bg-slate-900/90 px-4 py-3 text-left transition hover:bg-slate-800">Inspect Network</button>
          <button className="w-full rounded-2xl bg-slate-900/90 px-4 py-3 text-left transition hover:bg-slate-800">Manage Profiles</button>
        </div>
      </div>
    </aside>
  )
}
