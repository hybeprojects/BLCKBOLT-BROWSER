import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: string
  action?: string
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to BLCKBOLT',
    description:
      'The privacy-first browser for developers. Your data, your rules. Lets get you set up in 3 steps.',
    icon: '🛡️',
  },
  {
    id: 2,
    title: 'Choose Your Privacy Profile',
    description:
      'Select a preset or customize your shields. We recommend starting with Developer profile for maximum control.',
    icon: '⚙️',
    action: 'Select Profile',
  },
  {
    id: 3,
    title: 'Enable Privacy Shields',
    description:
      'Turn on AdBlock, Tor, and VPN to start browsing privately. You can adjust these anytime.',
    icon: '🔐',
    action: 'Enable All',
  },
  {
    id: 4,
    title: 'Youre All Set',
    description:
      'Start browsing privately. Check the Privacy Dashboard to monitor your protection in real time.',
    icon: '🚀',
    action: 'Start Browsing',
  },
]

interface OnboardingProps {
  onComplete?: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState('developer')

  const profiles = [
    {
      id: 'developer',
      name: 'Developer',
      description: 'Max control with detailed logging',
      features: ['AdBlock', 'VPN', 'DevTools', 'Inspector'],
    },
    {
      id: 'privacy',
      name: 'Privacy',
      description: 'Maximum privacy & security',
      features: ['Tor', 'VPN', 'AdBlock', 'FP-Randomize'],
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Lightweight & fast',
      features: ['AdBlock', 'Auto-update'],
    },
  ]

  const step = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete?.()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercent = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070d] p-4 overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-40 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Step {currentStep + 1} of {steps.length}</p>
            <p className="text-xs text-slate-500">{Math.round(progressPercent)}%</p>
          </div>
          <motion.div className="h-1.5 rounded-full overflow-hidden bg-slate-900">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-glow rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-3xl border border-white/10 p-10 shadow-soft text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-6xl mb-6"
            >
              {step.icon}
            </motion.div>

            <h2 className="text-3xl font-bold text-slate-100 mb-4">{step.title}</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">{step.description}</p>

            {/* Profile Selection (Step 2) */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
              >
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile.id)}
                    className={`rounded-2xl border-2 p-4 text-left transition-all ${
                      selectedProfile === profile.id
                        ? 'border-accent bg-accent/10'
                        : 'border-white/10 hover:border-white/20 bg-slate-900/50'
                    }`}
                  >
                    <p className="font-semibold text-slate-100 mb-1">{profile.name}</p>
                    <p className="text-xs text-slate-400 mb-3">{profile.description}</p>
                    <div className="space-y-1">
                      {profile.features.map((f) => (
                        <p key={f} className="text-xs text-slate-300">✓ {f}</p>
                      ))}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Shield Toggles (Step 3) */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-8"
              >
                {[
                  { label: 'AdBlock', icon: '🚫', color: 'from-red-500/20' },
                  { label: 'VPN', icon: '🔐', color: 'from-green-500/20' },
                  { label: 'Tor', icon: '🧅', color: 'from-purple-500/20' },
                  { label: 'Fingerprint Randomize', icon: '🎲', color: 'from-blue-500/20' },
                ].map((shield) => (
                  <div
                    key={shield.label}
                    className={`rounded-2xl border border-white/10 p-4 flex items-center justify-between bg-gradient-to-r ${shield.color} to-transparent`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{shield.icon}</span>
                      <span className="text-slate-200 font-medium">{shield.label}</span>
                    </div>
                    <div className="w-12 h-7 rounded-full bg-accent relative">
                      <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-2xl border border-white/10 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {steps.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: idx === currentStep ? 1 : 0.8,
                  opacity: idx <= currentStep ? 1 : 0.5,
                }}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  idx === currentStep ? 'bg-accent' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-accent text-slate-950 font-semibold hover:bg-accentSoft transition"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'} →
          </button>
        </div>

        {/* Skip Option */}
        <button
          onClick={onComplete}
          className="block w-full mt-6 text-center text-xs uppercase tracking-[0.25em] text-slate-500 hover:text-slate-300 transition"
        >
          Skip Onboarding
        </button>
      </motion.div>
    </div>
  )
}
