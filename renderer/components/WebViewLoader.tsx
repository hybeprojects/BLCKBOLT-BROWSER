import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WebViewLoaderProps {
  src: string
  tabId?: string
  onLoad?: () => void
  onError?: (error: string) => void
}

export default function WebViewLoader({ src, tabId, onLoad, onError }: WebViewLoaderProps) {
  const ref = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Lazy observe when viewport enters
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || !ref.current || !window.blckboltAPI) return

    const handleWebViewReady = () => {
      setIsLoading(false)
      onLoad?.()
    }

    const handleWebViewError = (error: string) => {
      setIsLoading(false)
      onError?.(error)
    }

    // Simulate load
    const timer = setTimeout(() => {
      ref.current?.send?.('load-url', { url: src })
      handleWebViewReady()
    }, 300)

    return () => clearTimeout(timer)
  }, [isVisible, src, onLoad, onError])

  return (
    <div ref={contentRef} className="relative w-full h-full bg-slate-950 overflow-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-10"
          >
            {/* Skeleton Loading Animation */}
            <div className="p-4 space-y-4 h-full overflow-hidden">
              <motion.div
                className="h-12 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-lg"
                animate={{ backgroundPosition: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-8 w-3/4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-lg"
                animate={{ backgroundPosition: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
              <div className="space-y-3 pt-4">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded"
                    animate={{ backgroundPosition: ['0%', '100%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-500">
              Loading page...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WebView Container */}
      {isVisible && (
        <div className="w-full h-full">
          {/* @ts-ignore */}
          <webview ref={ref} src={src} className="w-full h-full" />
        </div>
      )}

      {/* Fallback for unloaded state */}
      {!isVisible && (
        <div className="w-full h-full flex items-center justify-center text-slate-500">
          <p className="text-sm">Webview will load when visible</p>
        </div>
      )}
    </div>
  )
}
