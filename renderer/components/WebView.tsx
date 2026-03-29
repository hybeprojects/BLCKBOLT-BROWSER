import React, { useEffect, useRef } from 'react'

export default function WebView() {
  const ref = useRef<any>(null)

  useEffect(() => {
    if (window.blckboltAPI && window.blckboltAPI.on) {
      window.blckboltAPI.on('protocol-url', (url: string) => {
        if (ref.current) {
          ref.current.src = url
        }
      })
      window.blckboltAPI.on('navigate', (url: string) => {
        if (ref.current) {
          ref.current.src = url
        }
      })
    }
  }, [])

  return (
    <div className="relative h-[calc(100vh-280px)] bg-slate-950 flex flex-col">
      <div className="flex-1 relative">
        {/* @ts-ignore */}
        <webview
          ref={ref}
          src="https://example.com"
          className="h-full w-full bg-slate-950"
          allowpopups={true}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      </div>

      {/* Mini status bar for the webview */}
      <div className="h-6 bg-slate-900/80 border-t border-white/5 flex items-center px-4 justify-between text-[10px] font-medium text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            READY
          </span>
          <span className="opacity-40">|</span>
          <span>SOCKS5: ACTIVE</span>
        </div>
        <div className="uppercase tracking-widest opacity-60">
          Secure Sandbox Environment
        </div>
      </div>
    </div>
  )
}
