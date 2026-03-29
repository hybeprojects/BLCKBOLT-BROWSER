import React, { useEffect, useRef, useState } from 'react'

const SAMPLE_HISTORY = [
  'https://example.com',
  'https://github.com',
  'https://news.ycombinator.com',
  'https://duckduckgo.com',
  'https://npmjs.com',
]

export default function BrowserHeader() {
  const [url, setUrl] = useState('https://example.com')
  const [secure, setSecure] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // keyboard shortcut: Ctrl/Cmd+L focuses the address bar
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac')
      if ((e.ctrlKey && !isMac && e.key.toLowerCase() === 'l') || (isMac && e.metaKey && e.key.toLowerCase() === 'l')) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const q = url.trim()
    if (!q) {
      setSuggestions([])
      setActiveIndex(null)
      return
    }

    const fromHistory = SAMPLE_HISTORY.filter((h) => h.includes(q)).slice(0, 4)
    const direct = q.startsWith('http') ? [q] : [`https://${q}`, `https://www.${q}`]
    const search = [`Search: ${q}`]
    const merged = Array.from(new Set([...fromHistory, ...direct, ...search])).slice(0, 6)
    setSuggestions(merged)
  }, [url])

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault()
    setSecure(url.startsWith('https://'))
    // send navigation event to main (if available)
    if (typeof window !== 'undefined' && (window as any).blckboltAPI) {
      ;(window as any).blckboltAPI.send?.('navigate', { url })
    }
    // close suggestions after navigation
    setSuggestions([])
    setActiveIndex(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i === null ? 0 : Math.min(i + 1, suggestions.length - 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i === null ? suggestions.length - 1 : Math.max(i - 1, 0)))
    } else if (e.key === 'Enter') {
      if (activeIndex !== null && suggestions[activeIndex]) {
        const sel = suggestions[activeIndex]
        setUrl(sel)
        setSuggestions([])
        setActiveIndex(null)
        // optionally navigate immediately
        handleSubmit()
      } else {
        handleSubmit()
      }
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setActiveIndex(null)
    }
  }

  const handleSelect = (s: string) => {
    setUrl(s)
    setSuggestions([])
    setActiveIndex(null)
    handleSubmit()
  }

  return (
    <section className="glass-panel rounded-[2.5rem] p-3 border border-white/10 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4 px-2">
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-accent to-accentSoft text-slate-950 font-bold text-xl shadow-lg shadow-accent/20">
              B
            </span>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-[#05070d] shadow-sm" />
          </div>
          <div className="hidden xl:block">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500 leading-tight">Terminal</p>
            <p className="text-sm font-semibold text-slate-200 tracking-tight">Active Session</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c4.56 0 8.33 3.03 9.46 7.15"/><path d="M21 3v9h-9"/></svg>
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="flex-1 min-w-0">
          <label className="sr-only" htmlFor="address">Address bar</label>
          <div className="relative group">
            <div className={`relative flex items-center h-12 rounded-2xl bg-slate-950/80 border transition-all duration-300 ${
              secure ? 'border-success/20 focus-within:border-success/40 shadow-[0_0_20px_rgba(34,197,94,0.05)]' : 'border-white/5 focus-within:border-accent/40 shadow-inner'
            }`}>
              <div className="flex items-center gap-2 pl-4 pr-3 shrink-0 border-r border-white/5 mr-3">
                <div className={`h-2 w-2 rounded-full ${secure ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${secure ? 'text-success' : 'text-warning'}`}>
                  {secure ? 'Encrypted' : 'Insecure'}
                </span>
              </div>

              <input
                id="address"
                ref={inputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => { setSuggestions([]); setActiveIndex(null) }, 150)}
                className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600 font-medium"
                placeholder="Search or enter secure URL..."
                aria-autocomplete="list"
                aria-controls="omnibox-list"
                aria-expanded={suggestions.length > 0}
              />

              <div className="flex items-center gap-2 pr-2 shrink-0">
                <button type="submit" className="h-8 px-4 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors">
                  Fetch
                </button>
              </div>
            </div>

            {suggestions.length > 0 && (
              <ul id="omnibox-list" role="listbox" aria-label="Suggestions" className="mt-2 w-full max-w-full rounded-xl overflow-hidden bg-slate-900 border border-white/6 shadow-lg">
                {suggestions.map((s, idx) => (
                  <li
                    key={s}
                    role="option"
                    aria-selected={activeIndex === idx}
                    onMouseDown={(ev) => { ev.preventDefault(); handleSelect(s) }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`cursor-pointer px-4 py-3 text-sm ${activeIndex === idx ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:bg-slate-850'}`}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        <div className="flex items-center gap-3 px-2">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-white/5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Latency</span>
            <span className="text-xs font-mono text-success">24ms</span>
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-accent hover:border-accent/20 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </button>
        </div>
      </div>
    </section>
  )
}
