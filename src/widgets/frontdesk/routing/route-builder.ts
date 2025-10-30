/**
 * FrontDesk Route Builder
 *
 * Builds URL paths from strongly-typed FrontDesk routes.
 * Handles all route types and query parameters for navigation.
 */

import { FrontDeskRoute, RouteType, FrontDeskChannel, FrontDeskSection, TicketView, NavigationOptions } from "./types";

/**
 * Build URL path from route
 */
export const buildRoutePath = (route: FrontDeskRoute): string => {
  console.log("[FrontDesk Route Builder] Building path for route:", route);

  let path: string;

  switch (route.type) {
    case RouteType.INBOX:
      path = "/frontdesk/inbox";
      break;

    case RouteType.CHANNEL: {
      const channelPath = mapChannelToPath(route.channel);
      path = `/frontdesk/inbox/${channelPath}`;

      // Add query params if present
      const queryParams = new URLSearchParams();
      if (route.accountId) {
        queryParams.append("account", route.accountId);
      }
      if (route.conversationId) {
        queryParams.append("conversation", route.conversationId);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        path += `?${queryString}`;
      }
      break;
    }

    case RouteType.TICKET_LIST: {
      const viewPath = mapTicketViewToPath(route.view);
      path = `/frontdesk/tickets/${viewPath}`;
      break;
    }

    case RouteType.TICKET_DETAIL: {
      path = `/frontdesk/tickets/${route.ticketId}`;
      break;
    }

    case RouteType.SECTION: {
      path = `/frontdesk/${route.section}`;
      break;
    }

    default:
      path = "/frontdesk/inbox";
      break;
  }

  console.log("[FrontDesk Route Builder] Built path:", path);
  return path;
};

/**
 * Map channel enum to URL path segment
 */
const mapChannelToPath = (channel: FrontDeskChannel): string => {
  const map: Record<FrontDeskChannel, string> = {
    [FrontDeskChannel.ALL]: "unified",
    [FrontDeskChannel.EMAIL]: "email",
    [FrontDeskChannel.WHATSAPP]: "whatsapp",
    [FrontDeskChannel.INTERNAL]: "internal",
  };
  return map[channel];
};

/**
 * Map ticket view enum to URL path segment
 */
const mapTicketViewToPath = (view: TicketView): string => {
  const map: Record<TicketView, string> = {
    [TicketView.MY_TICKETS]: "my-tickets",
    [TicketView.UNASSIGNED]: "unassigned",
    [TicketView.ALL_TICKETS]: "all-tickets",
    [TicketView.DONE]: "done",
    [TicketView.ARCHIVED]: "archived",
  };
  return map[view];
};

/**
 * Build a route for navigation with options
 */
export interface BuiltRoute {
  path: string;
  options: NavigationOptions;
}

export const buildRoute = (route: FrontDeskRoute, options: NavigationOptions = {}): BuiltRoute => {
  const path = buildRoutePath(route);
  return {
    path,
    options: {
      replace: options.replace || false,
      scroll: options.scroll !== false, // Default to true
      newTab: options.newTab || false,
    },
  };
};

/**
 * Route builder factory functions for convenience
 */
export const RouteBuilder = {
  /**
   * Build inbox route (unified dashboard)
   */
  inbox: (): FrontDeskRoute => ({
    type: RouteType.INBOX,
  }),

  /**
   * Build channel route
   */
  channel: (channel: FrontDeskChannel, conversationId?: string, accountId?: string): FrontDeskRoute => ({
    type: RouteType.CHANNEL,
    channel,
    conversationId,
    accountId,
  }),

  /**
   * Build email channel route
   */
  email: (conversationId?: string, accountId?: string): FrontDeskRoute => ({
    type: RouteType.CHANNEL,
    channel: FrontDeskChannel.EMAIL,
    conversationId,
    accountId,
  }),

  /**
   * Build WhatsApp channel route
   */
  whatsapp: (conversationId?: string): FrontDeskRoute => RouteBuilder.channel(FrontDeskChannel.WHATSAPP, conversationId),

  /**
   * Build internal (DM) channel route
   */
  internal: (conversationId?: string): FrontDeskRoute => RouteBuilder.channel(FrontDeskChannel.INTERNAL, conversationId),

  /**
   * Build ticket list route
   */
  ticketList: (view: TicketView): FrontDeskRoute => ({
    type: RouteType.TICKET_LIST,
    view,
  }),

  /**
   * Build my tickets route
   */
  myTickets: (): FrontDeskRoute => RouteBuilder.ticketList(TicketView.MY_TICKETS),

  /**
   * Build unassigned tickets route
   */
  unassignedTickets: (): FrontDeskRoute => RouteBuilder.ticketList(TicketView.UNASSIGNED),

  /**
   * Build all tickets route
   */
  allTickets: (): FrontDeskRoute => RouteBuilder.ticketList(TicketView.ALL_TICKETS),

  /**
   * Build done tickets route
   */
  doneTickets: (): FrontDeskRoute => RouteBuilder.ticketList(TicketView.DONE),

  /**
   * Build ticket detail route
   */
  ticketDetail: (ticketId: string, view?: TicketView): FrontDeskRoute => ({
    type: RouteType.TICKET_DETAIL,
    ticketId,
    view,
  }),

  /**
   * Build section route
   */
  section: (section: FrontDeskSection.ASSIGNED | FrontDeskSection.ADMIN | FrontDeskSection.SETTINGS): FrontDeskRoute => ({
    type: RouteType.SECTION,
    section,
  }),

  /**
   * Build assigned section route
   */
  assigned: (): FrontDeskRoute => RouteBuilder.section(FrontDeskSection.ASSIGNED),

  /**
   * Build admin section route
   */
  admin: (): FrontDeskRoute => RouteBuilder.section(FrontDeskSection.ADMIN),

  /**
   * Build settings section route
   */
  settings: (): FrontDeskRoute => RouteBuilder.section(FrontDeskSection.SETTINGS),
};

/**
 * Get route metadata for display purposes
 */
export const getRouteMetadata = (route: FrontDeskRoute) => {
  switch (route.type) {
    case RouteType.INBOX:
      return {
        title: "Dashboard",
        breadcrumbs: ["FrontDesk", "Dashboard"],
      };

    case RouteType.CHANNEL: {
      const channelNames = {
        [FrontDeskChannel.ALL]: "All Channels",
        [FrontDeskChannel.EMAIL]: "Email",
        [FrontDeskChannel.WHATSAPP]: "WhatsApp",
        [FrontDeskChannel.INTERNAL]: "Direct Messages",
      };
      return {
        title: channelNames[route.channel],
        breadcrumbs: ["FrontDesk", "Inbox", channelNames[route.channel]],
      };
    }

    case RouteType.TICKET_LIST: {
      const viewNames = {
        [TicketView.MY_TICKETS]: "My Tickets",
        [TicketView.UNASSIGNED]: "Unassigned",
        [TicketView.ALL_TICKETS]: "All Tickets",
        [TicketView.DONE]: "Done",
        [TicketView.ARCHIVED]: "Archived",
      };
      return {
        title: viewNames[route.view],
        breadcrumbs: ["FrontDesk", "Tickets", viewNames[route.view]],
      };
    }

    case RouteType.TICKET_DETAIL:
      return {
        title: `Ticket ${route.ticketId}`,
        breadcrumbs: ["FrontDesk", "Tickets", route.ticketId],
      };

    case RouteType.SECTION: {
      const sectionNames = {
        [FrontDeskSection.ASSIGNED]: "Assigned",
        [FrontDeskSection.ADMIN]: "Admin",
        [FrontDeskSection.SETTINGS]: "Settings",
      };
      return {
        title: sectionNames[route.section],
        breadcrumbs: ["FrontDesk", sectionNames[route.section]],
      };
    }

    default:
      return {
        title: "FrontDesk",
        breadcrumbs: ["FrontDesk"],
      };
  }
};

/**
 * Compare two routes for equality
 */
export const routesEqual = (a: FrontDeskRoute, b: FrontDeskRoute): boolean => {
  if (a.type !== b.type) return false;

  switch (a.type) {
    case RouteType.INBOX:
      return true;

    case RouteType.CHANNEL:
      return a.channel === (b as any).channel && a.conversationId === (b as any).conversationId;

    case RouteType.TICKET_LIST:
      return a.view === (b as any).view;

    case RouteType.TICKET_DETAIL:
      return a.ticketId === (b as any).ticketId;

    case RouteType.SECTION:
      return a.section === (b as any).section;

    default:
      return false;
  }
};

/**
 * Get a human-readable description of a route (for debugging)
 */
export const describeRoute = (route: FrontDeskRoute): string => {
  switch (route.type) {
    case RouteType.INBOX:
      return "Dashboard (Unified Inbox)";

    case RouteType.CHANNEL:
      return `Channel: ${route.channel}${route.conversationId ? ` (conversation: ${route.conversationId})` : ""}`;

    case RouteType.TICKET_LIST:
      return `Tickets: ${route.view}`;

    case RouteType.TICKET_DETAIL:
      return `Ticket Detail: ${route.ticketId}`;

    case RouteType.SECTION:
      return `Section: ${route.section}`;

    default:
      return "Unknown route";
  }
};
