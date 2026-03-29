import React, { useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Tab {
  id: string
  title: string
  group?: string
  active: boolean
}

const initialTabs: Tab[] = [
  { id: '1', title: 'Home', group: 'work', active: true },
  { id: '2', title: 'Privacy', group: 'work', active: false },
  { id: '3', title: 'Settings', active: false },
  { id: '4', title: 'Docs', group: 'docs', active: false },
  { id: '5', title: 'Github', group: 'docs', active: false },
]

export default function TabBar() {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs)
  const [activeTab, setActiveTab] = useState('1')
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['work']))
  const [searchQuery, setSearchQuery] = useState('')
  const [showOverflow, setShowOverflow] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Group tabs
  const groupedTabs = useMemo(() => {
    const groups: Record<string, Tab[]> = {}
    const ungrouped: Tab[] = []
    tabs.forEach((t) => {
      if (t.group) {
        if (!groups[t.group]) groups[t.group] = []
        groups[t.group].push(t)
      } else {
        ungrouped.push(t)
      }
    })
    return { groups, ungrouped }
  }, [tabs])

  // Filter by search
  const filtered = useMemo(() => {
    if (!searchQuery) return tabs
    return tabs.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [tabs, searchQuery])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.effectAllowed = 'move'
    setDragging(id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault()
    setDragOverId(id)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropId: string) => {
    e.preventDefault()
    if (dragging && dragging !== dropId) {
      const dragIdx = tabs.findIndex((t) => t.id === dragging)
      const dropIdx = tabs.findIndex((t) => t.id === dropId)
      const newTabs = [...tabs]
      const [moved] = newTabs.splice(dragIdx, 1)
      newTabs.splice(dropIdx, 0, moved)
      setTabs(newTabs)
    }
    setDragging(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDragOverId(null)
  }

  const closeTab = (id: string) => {
    const newTabs = tabs.filter((t) => t.id !== id)
    setTabs(newTabs)
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[0].id)
    }
  }

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups)
    newExpanded.has(group) ? newExpanded.delete(group) : newExpanded.add(group)
    setExpandedGroups(newExpanded)
  }

  const TabButton = ({ tab, isSearch }: { tab: Tab; isSearch?: boolean }) => (
    <motion.div
      key={tab.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      draggable
      onDragStart={(e: any) => handleDragStart(e, tab.id)}
      onDragOver={(e: any) => handleDragOver(e, tab.id)}
      onDrop={(e: any) => handleDrop(e, tab.id)}
      onDragEnd={handleDragEnd}
      onDragLeave={() => setDragOverId(null)}
      className={`group relative min-w-[140px] max-w-[200px] flex-1 cursor-default select-none ${
        dragging === tab.id ? 'opacity-40' : ''
      }`}
    >
      <div
        onClick={() => setActiveTab(tab.id)}
        className={`relative flex items-center justify-between h-10 px-4 transition-all duration-300 rounded-xl overflow-hidden border ${
          activeTab === tab.id
            ? 'bg-accent/10 border-accent/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
            : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 hover:border-white/10'
        } ${dragOverId === tab.id && dragging && dragging !== tab.id ? 'ring-2 ring-accent' : ''}`}
      >
        {activeTab === tab.id && (
          <motion.div
            layoutId="activeTabGlow"
            className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent pointer-events-none"
          />
        )}

        <div className="flex items-center gap-2 overflow-hidden z-10">
          <span className="shrink-0 text-[10px] opacity-30 group-hover:opacity-60 transition-opacity cursor-move">
            ⋮⋮
          </span>
          <span className={`text-sm font-medium truncate ${
            activeTab === tab.id ? 'text-accentSoft' : 'text-slate-400 group-hover:text-slate-200'
          }`}>
            {tab.title}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
          className={`shrink-0 ml-2 h-5 w-5 flex items-center justify-center rounded-md transition-all z-10 ${
            activeTab === tab.id
              ? 'text-accentSoft hover:bg-accent/20'
              : 'text-slate-600 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <span className="text-[10px]">✕</span>
        </button>
      </div>
    </motion.div>
  )

  const visibleTabs = tabs.slice(0, 5)
  const overflowTabs = tabs.slice(5)

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-[2rem] border border-white/10 p-3 shadow-soft">
        {/* Tab Search Bar */}
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="text"
              placeholder="Search active tabs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-slate-950/50 border border-white/5 pl-10 pr-4 py-2.5 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all"
            />
          </div>
          <button className="h-10 px-5 rounded-2xl bg-accent text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-accentSoft active:scale-95 transition-all shadow-lg shadow-accent/20">
            New Tab
          </button>
          {overflowTabs.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowOverflow(!showOverflow)}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                +{overflowTabs.length}
              </button>
              <AnimatePresence>
                {showOverflow && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-slate-900 border border-white/10 shadow-lg overflow-hidden z-50"
                  >
                    <div className="max-h-64 overflow-y-auto">
                      {overflowTabs.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => { setActiveTab(t.id); setShowOverflow(false) }}
                          className="block w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 transition"
                        >
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Tab List */}
        <div
          ref={scrollRef}
          className="flex flex-wrap gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Open tabs"
        >
          <AnimatePresence mode="popLayout">
            {(searchQuery ? filtered : visibleTabs).map((tab) => (
              <TabButton key={tab.id} tab={tab} isSearch={!!searchQuery} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Tab Groups */}
      <AnimatePresence>
        {Object.entries(groupedTabs.groups).map(([groupName, groupTabs]) => (
          <motion.div key={groupName} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <button
              onClick={() => toggleGroup(groupName)}
              className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.25em] font-semibold text-slate-400 hover:text-slate-300 transition"
            >
              <span>{expandedGroups.has(groupName) ? '▼' : '▶'}</span>
              {groupName}
              <span className="text-slate-600 text-[11px]">({groupTabs.length})</span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: expandedGroups.has(groupName) ? 'auto' : 0, opacity: expandedGroups.has(groupName) ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {expandedGroups.has(groupName) && (
                <div className="glass-panel rounded-2xl border border-white/10 p-3 shadow-soft">
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence mode="popLayout">
                      {groupTabs.map((tab) => (
                        <TabButton key={tab.id} tab={tab} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
