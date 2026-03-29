import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeProvider'

interface SettingsTab {
  id: string
  label: string
  icon: string
  count?: number
}

const tabs: SettingsTab[] = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'privacy', label: 'Privacy', icon: '🔐' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'shortcuts', label: 'Keyboard', icon: '⌨️' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
]

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general')
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    autoUpdate: true,
    blockThirdPartyCookies: true,
    dntHeader: true,
    defaultSearchEngine: 'duckduckgo',
    homePage: 'about:blank',
  })

  if (!isOpen) return null

  const handleThemeChange = (t: 'dark' | 'light' | 'system') => {
    setTheme(t)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        role="presentation"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:rounded-3xl md:border md:border-white/10 md:shadow-soft bg-slate-900 flex flex-col md:max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-800 transition focus:ring-2 focus:ring-accent focus:outline-none"
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="hidden md:flex flex-col w-48 border-r border-white/10 bg-slate-950/50 overflow-y-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 px-4 py-3 text-left text-sm transition focus:ring-2 focus:ring-inset focus:ring-accent focus:outline-none ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-slate-100 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {tab.count && (
                    <span className="ml-auto rounded-full bg-accent px-2 py-1 text-xs font-semibold text-slate-950">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === 'general' && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-slate-100">General Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Default Search Engine
                        </label>
                        <select
                          value={settings.defaultSearchEngine}
                          onChange={(e) =>
                            setSettings({ ...settings, defaultSearchEngine: e.target.value })
                          }
                          className="w-full rounded-2xl bg-slate-800 border border-white/10 px-4 py-2 text-slate-100 focus:ring-2 focus:ring-accent focus:outline-none"
                        >
                          <option value="duckduckgo">DuckDuckGo</option>
                          <option value="brave">Brave Search</option>
                          <option value="startpage">StartPage</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Home Page
                        </label>
                        <input
                          type="text"
                          value={settings.homePage}
                          onChange={(e) => setSettings({ ...settings, homePage: e.target.value })}
                          className="w-full rounded-2xl bg-slate-800 border border-white/10 px-4 py-2 text-slate-100 focus:ring-2 focus:ring-accent focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">Auto-Update</label>
                        <button
                          onClick={() => setSettings({ ...settings, autoUpdate: !settings.autoUpdate })}
                          className={`rounded-full p-1 transition ${
                            settings.autoUpdate ? 'bg-accent text-slate-950' : 'bg-slate-800'
                          }`}
                          role="switch"
                          aria-checked={settings.autoUpdate}
                        >
                          {settings.autoUpdate ? '✓' : '○'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-slate-100">Appearance</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-300 mb-3">Theme</p>
                        <div className="grid grid-cols-3 gap-3">
                          {(['dark', 'light', 'system'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => handleThemeChange(t)}
                              className={`rounded-2xl border-2 px-4 py-3 text-sm font-medium transition ${
                                theme === t
                                  ? 'border-accent bg-accent/10 text-slate-100'
                                  : 'border-white/10 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                          Accent Color
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                          {['#7c3aed', '#8b5cf6', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'].map(
                            (color) => (
                              <button
                                key={color}
                                className="h-8 rounded-lg border-2 border-white/20 transition hover:border-white/40"
                                style={{ backgroundColor: color }}
                                aria-label={`Select color ${color}`}
                              />
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-slate-100">Privacy & Security</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'blockThirdPartyCookies', label: 'Block Third-Party Cookies' },
                        { key: 'dntHeader', label: 'Send Do Not Track Signal' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between rounded-2xl bg-slate-800/50 p-3">
                          <label className="text-sm font-medium text-slate-300">{item.label}</label>
                          <button
                            onClick={() =>
                              setSettings({
                                ...settings,
                                [item.key]: !settings[item.key as keyof typeof settings],
                              })
                            }
                            className={`rounded-full p-1 transition ${
                              settings[item.key as keyof typeof settings]
                                ? 'bg-accent text-slate-950'
                                : 'bg-slate-700'
                            }`}
                            role="switch"
                            aria-checked={settings[item.key as keyof typeof settings] as boolean}
                          >
                            {settings[item.key as keyof typeof settings] ? '✓' : '○'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-slate-100">About BLCKBOLT</h3>
                    <div className="space-y-3 text-sm text-slate-400">
                      <p>Version: 0.1.0</p>
                      <p>Built with Next.js, Electron, and Framer Motion</p>
                      <p className="pt-4">
                        BLCKBOLT is a privacy-first browser for developers. Your data is yours.
                      </p>
                      <button className="mt-4 rounded-2xl bg-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-700 transition">
                        Check for Updates
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-2xl px-6 py-2 text-slate-200 hover:bg-slate-800 transition focus:ring-2 focus:ring-accent focus:outline-none"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="rounded-2xl bg-accent px-6 py-2 font-semibold text-slate-950 hover:bg-accentSoft transition focus:ring-2 focus:ring-accent/50 focus:outline-none"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
