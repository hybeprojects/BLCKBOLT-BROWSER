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
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl border border-white/10 p-5 shadow-soft custom-scrollbar overflow-y-auto max-h-[calc(100vh-140px-1rem)]">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Privacy Overview</p>
            <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
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

        <motion.div variants={itemVariants} className="glass-panel rounded-3xl border border-white/10 p-5 shadow-soft">
          <h3 className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-4">Quick Actions</h3>
          <div className="grid gap-3 text-sm text-slate-300">
            {[
              { label: 'Open Privacy Report', icon: '📊' },
              { label: 'Inspect Network', icon: '🔍' },
              { label: 'Manage Profiles', icon: '🛡️' },
            ].map((action, idx) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 + 0.3 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(71, 85, 105, 0.7)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl bg-slate-900/50 px-4 py-3 text-left transition focus:ring-2 focus:ring-accent focus:outline-none"
                aria-label={action.label}
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </aside>
  )
}
