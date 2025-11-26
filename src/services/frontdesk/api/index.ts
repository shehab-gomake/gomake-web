/**
 * FrontDesk API Services
 * Centralized export for all REST API services
 */

// Export all endpoint functions
export * from './frontdesk-endpoints';

// Export individual service modules
export * from './direct-messages.service';
export * from './tickets.service';
export * from './notifications.service';

// Export Chatwoot integration
export * from './chatwoot';

// Export utilities
export * from '../utils/email-validation.utils';
