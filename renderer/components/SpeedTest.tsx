import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface SpeedTestResult {
  downloadSpeed: number // Mbps
  uploadSpeed: number // Mbps
  latency: number // ms
  jitter: number // ms
  throttled: boolean
  timestamp: Date
}

interface SpeedTestProps {
  onComplete?: (result: SpeedTestResult) => void
}

export default function SpeedTest({ onComplete }: SpeedTestProps) {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<SpeedTestResult | null>(null)
  const [progress, setProgress] = useState(0)

  const runSpeedTest = useCallback(async () => {
    setTesting(true)
    setProgress(0)
    setResults(null)

    try {
      // Simulate speed test with 5 stages
      const stages = ['Latency', 'Download', 'Upload', 'Jitter', 'Analysis']
      
      for (let i = 0; i < stages.length; i++) {
        // Simulate each stage
        await new Promise((resolve) => setTimeout(resolve, 800))
        setProgress(((i + 1) / stages.length) * 100)
      }

      // Simulate realistic results
      const downloadSpeed = Math.random() * 100 + 20 // 20-120 Mbps
      const uploadSpeed = Math.random() * 50 + 5 // 5-55 Mbps
      const latency = Math.random() * 50 + 10 // 10-60ms
      const jitter = Math.random() * 20 // 0-20ms
      
      // Detect throttling (unusual patterns)
      const isThrottled = downloadSpeed < 30 && latency > 40

      const result: SpeedTestResult = {
        downloadSpeed: Math.round(downloadSpeed * 10) / 10,
        uploadSpeed: Math.round(uploadSpeed * 10) / 10,
        latency: Math.round(latency),
        jitter: Math.round(jitter),
        throttled: isThrottled,
        timestamp: new Date(),
      }

      setResults(result)
      onComplete?.(result)
    } catch (e) {
      console.error('Speed test failed:', e)
    } finally {
      setTesting(false)
      setProgress(0)
    }
  }, [onComplete])

  const getSpeedColor = (speed: number) => {
    if (speed > 50) return 'text-green-400'
    if (speed > 20) return 'text-orange-400'
    return 'text-red-400'
  }

  const getLatencyColor = (latency: number) => {
    if (latency < 20) return 'text-green-400'
    if (latency < 50) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className="glass-panel rounded-2xl border border-white/10 p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Connection Speed</p>
          <p className="text-lg font-semibold text-slate-100 mt-1">🚀 Speed Test</p>
        </div>
        {results && !testing && (
          <span className={`text-lg ${results.throttled ? 'text-orange-400' : 'text-green-400'}`}>
            {results.throttled ? '⚠️ Throttled' : '✓ Normal'}
          </span>
        )}
      </div>

      {!results && !testing && (
        <button
          onClick={runSpeedTest}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-slate-100 hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <span>⚡ Run Test</span>
        </button>
      )}

      {testing && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Testing connection...</span>
              <span className="text-slate-300 font-medium">{Math.round(progress)}%</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
            />
          </div>
          <button
            onClick={runSpeedTest}
            disabled
            className="w-full rounded-xl bg-slate-700 px-4 py-3 font-medium text-slate-400 disabled:opacity-50"
          >
            Testing...
          </button>
        </div>
      )}

      {results && !testing && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-900/50 p-3">
              <p className="text-xs text-slate-400 mb-1">Download</p>
              <p className={`text-2xl font-bold ${getSpeedColor(results.downloadSpeed)}`}>
                {results.downloadSpeed}
              </p>
              <p className="text-xs text-slate-500">Mbps</p>
            </div>
            <div className="rounded-xl bg-slate-900/50 p-3">
              <p className="text-xs text-slate-400 mb-1">Upload</p>
              <p className={`text-2xl font-bold ${getSpeedColor(results.uploadSpeed)}`}>
                {results.uploadSpeed}
              </p>
              <p className="text-xs text-slate-500">Mbps</p>
            </div>
            <div className="rounded-xl bg-slate-900/50 p-3">
              <p className="text-xs text-slate-400 mb-1">Latency</p>
              <p className={`text-2xl font-bold ${getLatencyColor(results.latency)}`}>
                {results.latency}
              </p>
              <p className="text-xs text-slate-500">ms</p>
            </div>
            <div className="rounded-xl bg-slate-900/50 p-3">
              <p className="text-xs text-slate-400 mb-1">Jitter</p>
              <p className="text-2xl font-bold text-slate-100">{results.jitter}</p>
              <p className="text-xs text-slate-500">ms</p>
            </div>
          </div>

          {results.throttled && (
            <div className="rounded-xl bg-orange-500/20 border border-orange-500/30 p-3">
              <p className="text-sm text-orange-300">
                ⚠️ Possible throttling detected. Consider enabling VPN or DNS over HTTPS.
              </p>
            </div>
          )}

          <button
            onClick={runSpeedTest}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-slate-100 hover:bg-blue-700 transition"
          >
            Re-run Test
          </button>
        </div>
      )}
    </motion.div>
  )
}
