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
    <div className="page-shell min-h-screen text-slate-100">
      <div className="max-w-[2000px] mx-auto px-4 py-4 space-y-4">
        <TabBar />
        <BrowserHeader />
        <div className="lg:flex lg:gap-4">
          <SidePanel />
          <main className="flex-1 rounded-3xl glass-panel overflow-hidden browser-card border border-white/10">
            <WebView />
          </main>
        </div>
      </div>
    </div>
  )
}
