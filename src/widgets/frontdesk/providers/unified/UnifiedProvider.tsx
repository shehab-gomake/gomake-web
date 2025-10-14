import React from 'react';
import { DashboardView } from './components/DashboardView';

/**
 * UnifiedProvider - FrontDesk Dashboard
 *
 * Displays a comprehensive overview dashboard with:
 * - Stats overview cards (unread messages, open tickets, etc.)
 * - Activity feed from all channels (email, WhatsApp, DMs)
 * - Ticket quick view sidebar (my tickets, unassigned, recently closed)
 *
 * This is the default landing view for FrontDesk.
 */
export const UnifiedProvider: React.FC = () => {
  return <DashboardView />;
};

export default UnifiedProvider;