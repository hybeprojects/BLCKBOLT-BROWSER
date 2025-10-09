import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import initProtocolHandler from './protocolHandler';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);

// initialize protocol handler to update UI when main process sends protocol URLs
initProtocolHandler();
