import React from 'react'
import VpnToggle from './VpnToggle'
import TorToggle from './TorToggle'
import AdblockToggle from './AdblockToggle'
import FingerprintIndicator from './FingerprintIndicator'

export default function SidePanel(){
  return (
    <aside className="w-64 bg-gray-850 p-4 hidden md:block border-r border-gray-800 h-full overflow-y-auto custom-scrollbar">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Privacy Shields</h3>

      <VpnToggle />
      <AdblockToggle />
      <TorToggle profileId="default" />
      <FingerprintIndicator />

      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">Quick Links</h3>
      <ul className="space-y-2 text-sm text-gray-400">
        <li className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-gray-800 rounded">Bookmarks</li>
        <li className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-gray-800 rounded">History</li>
        <li className="hover:text-white cursor-pointer transition-colors p-2 hover:bg-gray-800 rounded">Settings</li>
      </ul>
    </aside>
  )
}
