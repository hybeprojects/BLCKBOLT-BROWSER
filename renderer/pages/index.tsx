import BrowserHeader from '../components/BrowserHeader'
import TabBar from '../components/TabBar'
import SidePanel from '../components/SidePanel'
import WebView from '../components/WebView'
import SplashScreen from '../components/SplashScreen'
import { useEffect, useState } from 'react'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => { const t = setTimeout(()=>setShowSplash(false), 2000); return ()=>clearTimeout(t); }, []);

  if (showSplash) return <SplashScreen />

  return (
    <div className="min-h-screen bg-gradient-to-b from-bgDark to-gray-900 text-white font-orbitron">
      <TabBar />
      <BrowserHeader />
      <div className="flex">
        <SidePanel />
        <WebView />
      </div>
    </div>
  )
}
