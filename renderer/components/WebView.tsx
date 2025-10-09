import React, { useEffect, useRef } from 'react'

export default function WebView(){
  const ref = useRef(null as any);
  useEffect(()=>{
    // Wire protocol url incoming events
    const onProtocol = (e: any) => { console.log('Protocol event', e.detail); };
    window.addEventListener('blckbolt-protocol', onProtocol as any);
    return ()=> window.removeEventListener('blckbolt-protocol', onProtocol as any);
  },[]);
  return (
    <div className="flex-1 bg-black">
      <webview ref={ref} src="https://example.com" className="w-full h-[calc(100vh-120px)]" />
    </div>
  )
}
