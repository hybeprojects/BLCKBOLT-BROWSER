import React from 'react'

const tabs = [
  { title: 'Home', active: true },
  { title: 'Privacy', active: false },
  { title: 'Settings', active: false },
]

export default function TabBar() {
  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-3 shadow-soft">
      <div className="flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.title}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${tab.active ? 'bg-accent text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
          + New Window
        </button>
      </div>
    </div>
  )
}
