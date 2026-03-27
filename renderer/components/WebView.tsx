import React, { useEffect, useRef } from 'react'

export default function WebView(){
  const ref = useRef<any>(null);

  useEffect(() => {
    if (window.blckboltAPI && window.blckboltAPI.on) {
      window.blckboltAPI.on('protocol-url', (url: string) => {
        console.log('Protocol URL received:', url);
        if (ref.current) {
          ref.current.src = url;
        }
      });
    }
  }, []);

  return (
    <div className="flex-1 bg-black">
      {/* @ts-ignore */}
      <webview ref={ref} src="https://example.com" className="w-full h-[calc(100vh-120px)]" />
    </div>
  )
}
