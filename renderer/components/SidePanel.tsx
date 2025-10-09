import React from 'react'

export default function SidePanel(){
  return (
    <aside className="w-64 bg-gray-850 p-4 hidden md:block">
      <h3 className="text-sm font-semibold mb-2">Sidebar</h3>
      <ul className="space-y-2 text-sm">
        <li>Bookmarks</li>
        <li>History</li>
        <li>Settings</li>
      </ul>
    </aside>
  )
}
