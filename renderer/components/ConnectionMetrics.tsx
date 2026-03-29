import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ConnectionMetric {
  name: string
  value: string | number
  unit: string
  status: 'good' | 'warning' | 'critical'
  icon: string
}

interface ConnectionAlert {
  type: 'dpi' | 'mitm' | 'bgp' | 'throttle'
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: Date
  recommendation: string
}

export default function ConnectionMetrics() {
  const [metrics, setMetrics] = useState<ConnectionMetric[]>([])
  const [alerts, setAlerts] = useState<ConnectionAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading connection metrics
    const timer = setTimeout(() => {
      const mockMetrics: ConnectionMetric[] = [
        {
          name: 'Latency (Ping)',
          value: 28,
          unit: 'ms',
          status: 'good',
          icon: '⚡',
        },
        {
          name: 'Packet Loss',
          value: 0.1,
          unit: '%',
          status: 'good',
          icon: '📦',
        },
        {
          name: 'Jitter',
          value: 5,
          unit: 'ms',
          status: 'good',
          icon: '📊',
        },
        {
          name: 'DNS Latency',
          value: 15,
          unit: 'ms',
          status: 'good',
          icon: '🌐',
        },
        {
          name: 'Connection Type',
          value: 'TCP',
          unit: '',
          status: 'good',
          icon: '🔗',
        },
        {
          name: 'TLS Version',
          value: '1.3',
          unit: '',
          status: 'good',
          icon: '🔒',
        },
      ]

      const mockAlerts: ConnectionAlert[] = [
        {
          type: 'dpi',
          severity: 'low',
          message: 'Potential DPI (Deep Packet Inspection) detected',
          timestamp: new Date(Date.now() - 3600000),
          recommendation: 'Enable VPN or use DoH to obscure traffic patterns',
        },
      ]

      setMetrics(mockMetrics)
      setAlerts(mockAlerts)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'from-green-500/20 to-green-600/10'
      case 'warning':
        return 'from-orange-500/20 to-orange-600/10'
      case 'critical':
        return 'from-red-500/20 to-red-600/10'
      default:
        return 'from-slate-500/20 to-slate-600/10'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/20 text-green-400'
      case 'warning':
        return 'bg-orange-500/20 text-orange-400'
      case 'critical':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'from-blue-500/20 to-blue-600/10'
      case 'medium':
        return 'from-orange-500/20 to-orange-600/10'
      case 'high':
        return 'from-red-500/20 to-red-600/10'
      default:
        return 'from-slate-500/20 to-slate-600/10'
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-500/20 text-blue-400'
      case 'medium':
        return 'bg-orange-500/20 text-orange-400'
      case 'high':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="glass-panel rounded-3xl border border-white/10 p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Network Analysis</p>
          <h3 className="text-xl font-semibold text-slate-100 mt-1">Connection Metrics</h3>
        </div>
        {loading && <span className="text-sm text-slate-400">Measuring...</span>}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-16 rounded-xl bg-slate-800/50"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {metrics.map((metric, idx) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-2xl border border-white/10 p-4 bg-gradient-to-br ${getStatusColor(
                  metric.status
                )}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-400">{metric.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(metric.status)}`}>
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-slate-100">{metric.value}</p>
                  <p className="text-sm text-slate-400">{metric.unit}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Anomaly Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-300">
                Security Alerts
              </h4>
              {alerts.map((alert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`rounded-2xl border border-white/10 p-4 bg-gradient-to-br ${getSeverityColor(
                    alert.severity
                  )}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${getSeverityBadgeColor(
                            alert.severity
                          )}`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                        <p className="text-sm font-medium text-slate-200">{alert.message}</p>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        💡 Recommendation: {alert.recommendation}
                      </p>
                      <p className="text-xs text-slate-500">
                        Detected: {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition flex items-center justify-center gap-2">
              🔄 Refresh Metrics
            </button>
            <button className="rounded-xl bg-accent/20 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/30 transition flex items-center justify-center gap-2">
              🛡️ Enable Protection
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}
