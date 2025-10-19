/**
 * FrontDesk Route Parser
 *
 * Parses Next.js router query parameters into strongly-typed FrontDesk routes.
 * Handles all URL patterns and query parameters for deep linking.
 */

import {
  ParsedRoute,
  FrontDeskRoute,
  RouteType,
  FrontDeskChannel,
  FrontDeskSection,
  TicketView,
  RouteQueryParams,
} from "./types";

/**
 * Next.js router query interface
 */
export interface NextRouterQuery {
  frontdeskRoute?: string | string[];
  provider?: string | string[];
  view?: string | string[];
  ticket?: string | string[];
  conversation?: string | string[];
}

/**
 * Normalize query parameter to string or undefined
 */
const normalizeParam = (param: string | string[] | undefined): string | undefined => {
  if (Array.isArray(param)) return param[0];
  return param;
};

/**
 * Check if a string is a valid ticket ID format
 * Supports three formats:
 * 1. TICKET-XXXXX (legacy display format)
 * 2. Numeric ID (e.g., 12345)
 * 3. UUID (e.g., 846c2a13-4133-4046-b04a-e3607f8e45b6)
 */
const isTicketId = (value: string): boolean => {
  // Format 1: TICKET-XXXXX (legacy display format)
  if (value.startsWith("TICKET-")) return true;

  // Format 2: Pure numeric ID
  if (/^\d+$/.test(value)) return true;

  // Format 3: UUID (8-4-4-4-12 format)
  // Matches: 846c2a13-4133-4046-b04a-e3607f8e45b6
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(value)) return true;

  return false;
};

/**
 * Parse frontdeskRoute segment to determine route type and parameters
 */
const parseFrontDeskRoute = (frontdeskRoute?: string): Partial<FrontDeskRoute> => {
  if (!frontdeskRoute || frontdeskRoute === "inbox") {
    return { type: RouteType.INBOX };
  }

  // Check if it's a ticket route
  if (frontdeskRoute === "tickets") {
    return { type: RouteType.TICKET_LIST };
  }

  // Check if it's a section route
  if (frontdeskRoute === "assigned") {
    return { type: RouteType.SECTION, section: FrontDeskSection.ASSIGNED };
  }
  if (frontdeskRoute === "admin") {
    return { type: RouteType.SECTION, section: FrontDeskSection.ADMIN };
  }
  if (frontdeskRoute === "settings") {
    return { type: RouteType.SECTION, section: FrontDeskSection.SETTINGS };
  }

  // Default to inbox
  return { type: RouteType.INBOX };
};

/**
 * Parse provider segment to determine channel or ticket details
 */
const parseProvider = (provider?: string, baseRoute?: Partial<FrontDeskRoute>): Partial<FrontDeskRoute> => {
  if (!provider) return baseRoute || {};

  // If we're in ticket route context
  if (baseRoute?.type === RouteType.TICKET_LIST) {
    // Check if provider is a ticket ID
    if (isTicketId(provider)) {
      return {
        type: RouteType.TICKET_DETAIL,
        ticketId: provider,
      } as Partial<FrontDeskRoute>;
    }

    // Otherwise it's a ticket view
    const ticketViewMap: Record<string, TicketView> = {
      "my-tickets": TicketView.MY_TICKETS,
      unassigned: TicketView.UNASSIGNED,
      "all-tickets": TicketView.ALL_TICKETS,
      done: TicketView.DONE,
      archived: TicketView.ARCHIVED,
    };

    const view = ticketViewMap[provider];
    if (view) {
      return {
        type: RouteType.TICKET_LIST,
        view,
      } as Partial<FrontDeskRoute>;
    }
  }

  // Check if provider is a channel
  const channelMap: Record<string, FrontDeskChannel> = {
    unified: FrontDeskChannel.ALL,
    email: FrontDeskChannel.EMAIL,
    whatsapp: FrontDeskChannel.WHATSAPP,
    internal: FrontDeskChannel.INTERNAL,
  };

  const channel = channelMap[provider];
  if (channel) {
    return {
      type: RouteType.CHANNEL,
      channel,
    } as Partial<FrontDeskRoute>;
  }

  return baseRoute || {};
};

/**
 * Parse query parameters for additional context
 */
const parseQueryParams = (query: NextRouterQuery): RouteQueryParams => {
  return {
    view: normalizeParam(query.view),
    ticket: normalizeParam(query.ticket),
    conversation: normalizeParam(query.conversation),
  };
};

/**
 * Apply query parameter overrides to route
 * Query params (from notifications) take precedence
 */
const applyQueryParamOverrides = (route: Partial<FrontDeskRoute>, queryParams: RouteQueryParams): FrontDeskRoute => {
  // Handle view query param (from notifications)
  if (queryParams.view) {
    // Check if it's a channel view
    const channelMap: Record<string, FrontDeskChannel> = {
      internal: FrontDeskChannel.INTERNAL,
      email: FrontDeskChannel.EMAIL,
      whatsapp: FrontDeskChannel.WHATSAPP,
    };

    if (channelMap[queryParams.view]) {
      const channelRoute: ChannelRoute = {
        type: RouteType.CHANNEL,
        channel: channelMap[queryParams.view],
        conversationId: queryParams.conversation,
      };
      return channelRoute;
    }

    // Check if it's a ticket view
    const ticketViewMap: Record<string, TicketView> = {
      "my-tickets": TicketView.MY_TICKETS,
      unassigned: TicketView.UNASSIGNED,
      "all-tickets": TicketView.ALL_TICKETS,
      done: TicketView.DONE,
      archived: TicketView.ARCHIVED,
    };

    if (ticketViewMap[queryParams.view]) {
      const ticketRoute: TicketListRoute = {
        type: RouteType.TICKET_LIST,
        view: ticketViewMap[queryParams.view],
      };
      return ticketRoute;
    }
  }

  // Handle ticket query param (from notifications)
  if (queryParams.ticket) {
    const ticketRoute: TicketDetailRoute = {
      type: RouteType.TICKET_DETAIL,
      ticketId: queryParams.ticket,
      view: (route as any).view, // Preserve current view if available
    };
    return ticketRoute;
  }

  // Handle conversation query param
  if (queryParams.conversation && route.type === RouteType.CHANNEL) {
    return {
      ...route,
      conversationId: queryParams.conversation,
    } as ChannelRoute;
  }

  // Return route with defaults if needed
  return ensureValidRoute(route);
};

/**
 * Ensure route has all required fields with defaults
 */
const ensureValidRoute = (route: Partial<FrontDeskRoute>): FrontDeskRoute => {
  if (route.type === RouteType.INBOX) {
    return { type: RouteType.INBOX };
  }

  if (route.type === RouteType.CHANNEL) {
    return {
      type: RouteType.CHANNEL,
      channel: (route as any).channel || FrontDeskChannel.ALL,
      conversationId: (route as any).conversationId,
    };
  }

  if (route.type === RouteType.TICKET_LIST) {
    return {
      type: RouteType.TICKET_LIST,
      view: (route as any).view || TicketView.ALL_TICKETS,
    };
  }

  if (route.type === RouteType.TICKET_DETAIL) {
    return {
      type: RouteType.TICKET_DETAIL,
      ticketId: (route as any).ticketId || "",
      view: (route as any).view,
    };
  }

  if (route.type === RouteType.SECTION) {
    return {
      type: RouteType.SECTION,
      section: (route as any).section || FrontDeskSection.SETTINGS,
    };
  }

  // Default fallback
  return { type: RouteType.INBOX };
};

/**
 * Main parser function - converts Next.js query to FrontDesk route
 *
 * URL Patterns:
 * - /frontdesk/inbox → Inbox (unified dashboard)
 * - /frontdesk/inbox/email → Email channel
 * - /frontdesk/inbox/internal?conversation=123 → DM with conversation
 * - /frontdesk/tickets/my-tickets → Ticket list view
 * - /frontdesk/tickets/TICKET-123 → Ticket detail
 * - /frontdesk/assigned → Assigned section
 * - /frontdesk/inbox?view=email&conversation=456 → Deep link from notification
 */
export const parseRoute = (query: NextRouterQuery): ParsedRoute => {
  const frontdeskRoute = normalizeParam(query.frontdeskRoute);
  const provider = normalizeParam(query.provider);
  const queryParams = parseQueryParams(query);

  // Parse base route from frontdeskRoute segment
  let route = parseFrontDeskRoute(frontdeskRoute);

  // Parse provider segment if present
  route = parseProvider(provider, route);

  // Apply query parameter overrides (from notifications)
  const finalRoute = applyQueryParamOverrides(route, queryParams);

  return {
    route: finalRoute,
    queryParams,
  };
};

/**
 * Helper: Get current section from route (for backward compatibility)
 */
export const getSectionFromRoute = (route: FrontDeskRoute): "inbox" | "assigned" | "admin" | "settings" => {
  if (route.type === RouteType.SECTION) {
    return route.section as any;
  }
  return "inbox";
};

/**
 * Helper: Get current channel from route (for backward compatibility)
 */
export const getChannelFromRoute = (route: FrontDeskRoute): "all" | "email" | "whatsapp" | "internal" => {
  if (route.type === RouteType.CHANNEL) {
    return route.channel as any;
  }
  if (route.type === RouteType.INBOX) {
    return "all";
  }
  // For ticket routes or other sections, return 'all'
  return "all";
};

/**
 * Helper: Get ticket view from route (for backward compatibility)
 */
export const getTicketViewFromRoute = (route: FrontDeskRoute): TicketView | null => {
  if (route.type === RouteType.TICKET_LIST) {
    return route.view;
  }
  if (route.type === RouteType.TICKET_DETAIL) {
    return route.view || null;
  }
  return null;
};

/**
 * Helper: Check if route is in ticket mode
 */
export const isTicketRoute = (route: FrontDeskRoute): boolean => {
  return route.type === RouteType.TICKET_LIST || route.type === RouteType.TICKET_DETAIL;
};

import { InboxRoute, ChannelRoute, TicketListRoute, TicketDetailRoute } from "./types";
