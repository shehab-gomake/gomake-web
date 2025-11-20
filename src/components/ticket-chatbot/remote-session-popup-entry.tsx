import React from 'react';
import { createRoot } from 'react-dom/client';
import { RemoteSessionPopup } from './remote-session-popup';

// Entry point for the popup window
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<RemoteSessionPopup />);
} else {
  console.error('Root element not found');
}

