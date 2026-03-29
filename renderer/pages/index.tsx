import BrowserHeader from '../components/BrowserHeader'
import TabBar from '../components/TabBar'
import SidePanel from '../components/SidePanel'
import WebView from '../components/WebView'
import SplashScreen from '../components/SplashScreen'
import { useEffect, useState } from 'react'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) return <SplashScreen />

  return (
    <div className="page-shell min-h-screen text-slate-100 overflow-x-hidden">
      <div className="max-w-[2200px] mx-auto p-4 md:p-6 space-y-6">
        <div className="space-y-4">
          <TabBar />
          <BrowserHeader />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <SidePanel />
          <main className="flex-1 min-w-0 rounded-[2.5rem] glass-panel overflow-hidden browser-card border border-white/10 shadow-2xl relative">
            <WebView />
            {/* Subtle glow for the main container */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-white/5 rounded-[2.5rem]" />
          </main>
        </div>
      </div>
    </div>
  )
}
