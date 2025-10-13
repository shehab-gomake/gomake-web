/**
 * FrontDesk Routing System
 *
 * Centralized, type-safe routing for the FrontDesk feature.
 * Provides a clean abstraction over Next.js routing with strong TypeScript support.
 *
 * @example
 * ```typescript
 * import { useFrontDeskRouter, RouteBuilder } from '@/widgets/frontdesk/routing';
 *
 * function MyComponent() {
 *   const { navigate, currentRoute } = useFrontDeskRouter();
 *
 *   // Navigate to email channel
 *   navigate(RouteBuilder.email());
 *
 *   // Navigate to specific ticket
 *   navigate(RouteBuilder.ticketDetail('TICKET-123'));
 * }
 * ```
 */

// Types
export type {
  FrontDeskRoute,
  InboxRoute,
  ChannelRoute,
  TicketListRoute,
  TicketDetailRoute,
  SectionRoute,
  ParsedRoute,
  RouteQueryParams,
  NavigationOptions,
  RouteMetadata,
  Channel,
  Section,
  TicketViewLegacy,
} from './types';

export {
  FrontDeskSection,
  FrontDeskChannel,
  TicketView,
  RouteType,
  isInboxRoute,
  isChannelRoute,
  isTicketListRoute,
  isTicketDetailRoute,
  isSectionRoute,
  mapLegacyChannel,
  mapLegacySection,
  mapLegacyTicketView,
} from './types';

// Route Parser
export {
  parseRoute,
  getSectionFromRoute,
  getChannelFromRoute,
  getTicketViewFromRoute,
  isTicketRoute,
} from './route-parser';

export type { NextRouterQuery } from './route-parser';

// Route Builder
export {
  buildRoutePath,
  buildRoute,
  RouteBuilder,
  getRouteMetadata,
  routesEqual,
  describeRoute,
} from './route-builder';

export type { BuiltRoute } from './route-builder';

// Hooks
export {
  useFrontDeskRouter,
  useChannelNavigation,
  useTicketNavigation,
} from './hooks/use-frontdesk-router';

/**
 * Quick reference for common routing patterns:
 *
 * Navigation:
 * - navigate(RouteBuilder.inbox()) - Go to dashboard
 * - navigate(RouteBuilder.email()) - Go to email channel
 * - navigate(RouteBuilder.myTickets()) - Go to my tickets
 * - navigate(RouteBuilder.ticketDetail('TICKET-123')) - Go to ticket
 *
 * Route Checking:
 * - isTicketRoute(route) - Check if in ticket mode
 * - isInboxRoute(route) - Check if on inbox
 * - routesEqual(routeA, routeB) - Compare routes
 *
 * Backward Compatibility:
 * - currentSection - 'inbox' | 'assigned' | 'admin' | 'settings'
 * - currentChannel - 'all' | 'email' | 'whatsapp' | 'internal'
 * - currentTicketView - TicketView | null
 * - handleSectionChange(section) - Legacy section handler
 * - handleChannelChange(channel) - Legacy channel handler
 */
