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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      draggable
      onDragStart={(e: any) => handleDragStart(e, tab.id)}
      onDragOver={(e: any) => handleDragOver(e, tab.id)}
      onDrop={(e: any) => handleDrop(e, tab.id)}
      onDragEnd={handleDragEnd}
      onDragLeave={() => setDragOverId(null)}
      className={`relative rounded-2xl transition-all ${
        dragging === tab.id ? 'opacity-50' : ''
      } ${dragOverId === tab.id && dragging && dragging !== tab.id ? 'ring-2 ring-accent' : ''}`}
    >
      <button
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-2xl transition-all ${
          activeTab === tab.id
            ? 'bg-accent text-slate-950'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        <span className="select-none cursor-move text-xs">⋮⋮</span>
        {tab.title}
        <button
          onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
          className="ml-1 text-xs opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </button>
    </motion.div>
  )

  const visibleTabs = tabs.slice(0, 5)
  const overflowTabs = tabs.slice(5)

  return (
    <div className="space-y-3">
      <div className="glass-panel rounded-3xl border border-white/10 p-4 shadow-soft">
        {/* Tab Search Bar */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Quick search tabs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <button className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-accentSoft">
            + Tab
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
