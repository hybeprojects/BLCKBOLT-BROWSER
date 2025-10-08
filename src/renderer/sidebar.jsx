import React from 'react';
import VpnToggle from './components/VpnToggle';

const Sidebar = () => (
  <aside className="w-64 bg-gray-800 h-full flex flex-col items-center py-4 space-y-6">
    <VpnToggle />
    {/* Add more sidebar toggles here */}
  </aside>
);

export default Sidebar;
