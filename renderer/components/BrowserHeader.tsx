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
    <section className="glass-panel rounded-3xl p-4 border border-white/10 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">B</span>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">BLCKBOLT Browser</p>
            <p className="text-base text-slate-200">Secure browsing with developer grade privacy</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="flex-1">
          <label className="sr-only" htmlFor="address">Address bar</label>
          <div className="relative">
            <div className="relative rounded-3xl bg-slate-950/70 border border-slate-800 px-4 py-3 shadow-inner ring-1 ring-white/10 focus-within:border-accent focus-within:ring-accent/30 transition-all duration-200">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 px-2 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-400">{secure ? 'Secure' : 'Insecure'}</div>
              <input
                id="address"
                ref={inputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => { setSuggestions([]); setActiveIndex(null) }, 150)}
                className="w-full bg-transparent pl-24 pr-24 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                placeholder="Search or enter website name"
                aria-autocomplete="list"
                aria-controls="omnibox-list"
                aria-expanded={suggestions.length > 0}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 shadow-lg shadow-accent/30 hover:bg-accentSoft transition">
                Go
              </button>
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

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">◀ Back</button>
          <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">▶ Forward</button>
          <button className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accentSoft">New Tab</button>
        </div>
      </div>
    </section>
  )
}
