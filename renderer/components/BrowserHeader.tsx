import React, { useState } from 'react'

export default function BrowserHeader(){
  const [url, setUrl] = useState('https://example.com');
  return (
    <header className="px-4 py-2 flex items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="flex items-center gap-2">
        <button className="p-2 bg-gray-700 rounded">◀</button>
        <button className="p-2 bg-gray-700 rounded">▶</button>
        <button className="p-2 bg-gray-700 rounded">⟳</button>
      </div>
      <div className="flex-1 px-4">
        <input value={url} onChange={e=>setUrl(e.target.value)} className="w-full bg-gray-800 px-3 py-2 rounded outline-none border border-transparent focus:border-purple-600" />
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 bg-purple-700 rounded">+ Tab</button>
      </div>
    </header>
  )
}
