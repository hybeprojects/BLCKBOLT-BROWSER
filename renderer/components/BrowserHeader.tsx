import React, { useState } from 'react'

export default function BrowserHeader() {
  const [url, setUrl] = useState('https://example.com')
  const [secure, setSecure] = useState(true)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setSecure(url.startsWith('https://'))
  }

  return (
    <section className="glass-panel rounded-3xl p-4 border border-white/10 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">B</span>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">BLCKBOLT Browser</p>
            <p className="text-base text-slate-200">Secure browsing with developer grade privacy</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <label className="sr-only" htmlFor="address">Address bar</label>
          <div className="relative rounded-3xl bg-slate-950/70 border border-slate-800 px-4 py-3 shadow-inner ring-1 ring-white/10 focus-within:border-accent focus-within:ring-accent/30 transition-all duration-200">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 px-2 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-400">{secure ? 'Secure' : 'Insecure'}</div>
            <input
              id="address"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent pl-24 pr-24 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="Search or enter website name"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 shadow-lg shadow-accent/30 hover:bg-accentSoft transition">
              Go
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">◀ Back</button>
          <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">▶ Forward</button>
          <button className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accentSoft">New Tab</button>
        </div>
      </div>
    </section>
  )
}
