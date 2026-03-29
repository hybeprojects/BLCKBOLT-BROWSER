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
    <div className="relative h-[calc(100vh-240px)] bg-slate-950">
      {/* @ts-ignore */}
      <webview
        ref={ref}
        src="https://example.com"
        className="h-full w-full bg-slate-950"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
    </div>
  )
}
