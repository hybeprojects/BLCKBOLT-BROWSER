import React from 'react'
import { motion } from 'framer-motion'

export default function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070d] text-slate-100 overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-60" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 text-center shadow-soft"
      >
        <div className="mx-auto mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-accent text-4xl font-bold text-slate-950">
          B
        </div>
        <h1 className="text-4xl font-semibold tracking-[0.2em] text-white">BLCKBOLT</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          A next-generation privacy browser for modern workflows. Fast, secure, and built for developers.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-900/80 p-4 text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Built For</p>
            <p className="mt-2 text-sm font-medium text-slate-200">Privacy-first browsing</p>
          </div>
          <div className="rounded-3xl bg-slate-900/80 p-4 text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Powered By</p>
            <p className="mt-2 text-sm font-medium text-slate-200">Adblock, Tor, VPN workflow</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
