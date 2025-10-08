import React from 'react';
import VpnToggle from './components/VpnToggle';
import TorToggle from './components/TorToggle';
import TorStatusPanel from './components/TorStatusPanel';

const profileId = 'default'; // In a real app, this would be dynamic per user/profile

const Sidebar = () => (
  <aside className="w-64 bg-gray-800 h-full flex flex-col items-center py-4 space-y-6">
    <VpnToggle />
    <TorToggle profileId={profileId} />
    <TorStatusPanel profileId={profileId} />
    {/* Add more sidebar toggles here */}
  </aside>
);

export default Sidebar;
