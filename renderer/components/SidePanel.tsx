import React from 'react'
import { motion } from 'framer-motion'
import VpnToggle from './VpnToggle'
import TorToggle from './TorToggle'
import AdblockToggle from './AdblockToggle'
import FingerprintIndicator from './FingerprintIndicator'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export default function SidePanel() {
  return (
    <aside className="hidden md:block w-full max-w-xs shrink-0" role="complementary" aria-label="Privacy controls">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.div variants={itemVariants} className="glass-panel rounded-[2rem] border border-white/10 p-5 shadow-soft custom-scrollbar overflow-y-auto max-h-[calc(100vh-140px-1rem)]">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">Security Core</p>
              <div className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,148,0.5)]" />
            </div>
            <div className="rounded-2xl bg-slate-950/80 p-4 border border-white/5 space-y-4">
              <div className="flex items-center justify-between gap-3 text-sm text-slate-300 mb-3">
                <span>Network protection</span>
                <motion.span
                  className="text-accent font-medium"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Active
                </motion.span>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <motion.div className="rounded-2xl bg-slate-900/80 p-3 hover:bg-slate-800 transition" whileHover={{ scale: 1.02 }}>
                  Tor: <span className="font-medium text-slate-100">Ready</span>
                </motion.div>
                <motion.div className="rounded-2xl bg-slate-900/80 p-3 hover:bg-slate-800 transition" whileHover={{ scale: 1.02 }}>
                  Adblock: <span className="font-medium text-slate-100">Enabled</span>
                </motion.div>
                <motion.div className="rounded-2xl bg-slate-900/80 p-3 hover:bg-slate-800 transition" whileHover={{ scale: 1.02 }}>
                  Fingerprint: <span className="font-medium text-slate-100">Randomized</span>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <VpnToggle />
            <AdblockToggle />
            <TorToggle profileId="default" />
            <FingerprintIndicator />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel rounded-[2rem] border border-white/10 p-5 shadow-soft">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-5 px-1">Analysis Kit</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { label: 'DOM', icon: '⚡' },
              { label: 'SSL', icon: '🔐' },
              { label: 'Headers', icon: '📑' },
              { label: 'Inject', icon: '💉' },
            ].map((tool) => (
              <button key={tool.label} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-accent/40 hover:bg-slate-900 transition-all gap-1.5 group">
                <span className="text-lg group-hover:scale-110 transition-transform">{tool.icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">{tool.label}</span>
              </button>
            ))}
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-5 px-1">Quick Access</p>
          <div className="grid gap-3">
            {[
              { label: 'Privacy Lab', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg> },
              { label: 'Packet Inspect', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 10h10"/><path d="M7 14h10"/><path d="M7 6h10"/></svg> },
              { label: 'Session Root', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6a2 2 0 1 0-4 0v6"/><rect width="20" height="12" x="2" y="4" rx="2"/><path d="M2 10h20"/></svg> },
            ].map((action, idx) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 + 0.4 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                whileTap={{ scale: 0.98 }}
                className="group w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all border border-transparent hover:border-white/5"
                aria-label={action.label}
              >
                <span className="text-slate-500 group-hover:text-accent transition-colors">{action.icon}</span>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-100 transition-colors uppercase tracking-wider">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </aside>
  )
}
