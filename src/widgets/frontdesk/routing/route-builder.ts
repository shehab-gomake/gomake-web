/**
 * FrontDesk Route Builder
 *
 * Builds URL paths from strongly-typed FrontDesk routes.
 * Handles all route types and query parameters for navigation.
 * Includes validation for route parameters to prevent malformed URLs.
 */

import {
  FrontDeskRoute,
  RouteType,
  FrontDeskChannel,
  FrontDeskSection,
  TicketView,
  NavigationOptions,
  ChatwootView,
  ChatwootFilters,
  ChatwootSettingsSubpage,
} from "./types";

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Check if a string ID is valid (non-empty, non-whitespace)
 * @param id - The ID string to validate
 * @returns true if the ID is valid, false otherwise
 */
const isValidId = (id: string | undefined | null): id is string => {
  return typeof id === "string" && id.trim().length > 0;
};

/**
 * Sanitize an ID by trimming whitespace and returning undefined if empty
 * @param id - The ID string to sanitize
 * @returns The sanitized ID or undefined
 */
const sanitizeId = (id: string | undefined | null): string | undefined => {
  if (!isValidId(id)) return undefined;
  return id.trim();
};

/**
 * Validate and sanitize filter values, removing empty or invalid entries
 * @param filters - The filters object to sanitize
 * @returns Sanitized filters or undefined if no valid filters remain
 */
const sanitizeFilters = (filters: ChatwootFilters | undefined): ChatwootFilters | undefined => {
  if (!filters) return undefined;

  const sanitized: ChatwootFilters = {};
  let hasValidFilter = false;

  // Only include non-empty filter values
  if (isValidId(filters.status)) {
    sanitized.status = filters.status.trim();
    hasValidFilter = true;
  }
  if (isValidId(filters.assigneeType)) {
    sanitized.assigneeType = filters.assigneeType.trim();
    hasValidFilter = true;
  }
  if (isValidId(filters.inboxId)) {
    sanitized.inboxId = filters.inboxId.trim();
    hasValidFilter = true;
  }
  if (isValidId(filters.teamId)) {
    sanitized.teamId = filters.teamId.trim();
    hasValidFilter = true;
  }
  if (isValidId(filters.sortBy)) {
    sanitized.sortBy = filters.sortBy.trim();
    hasValidFilter = true;
  }
  if (isValidId(filters.search)) {
    sanitized.search = filters.search.trim();
    hasValidFilter = true;
  }
  if (isValidId(filters.labels)) {
    sanitized.labels = filters.labels.trim();
    hasValidFilter = true;
  }

  return hasValidFilter ? sanitized : undefined;
};

/**
 * Build URL path from route with validation
 *
 * Validates route parameters and builds a clean URL.
 * Empty or invalid IDs are excluded from the URL.
 *
 * @param route - The route object to build a path from
 * @returns A valid URL path string
 */
export const buildRoutePath = (route: FrontDeskRoute): string => {
  // Validate route object
  if (!route || typeof route !== "object" || !route.type) {
    console.warn("[RouteBuilder] Invalid route object, using default path");
    return "/frontdesk/chatwoot?view=dashboard";
  }

  let path: string;

  switch (route.type) {
    case RouteType.INBOX:
      path = "/frontdesk/inbox";
      break;

    case RouteType.CHANNEL: {
      // Validate channel enum
      if (!route.channel || !Object.values(FrontDeskChannel).includes(route.channel)) {
        console.warn("[RouteBuilder] Invalid channel, defaulting to ALL");
        path = "/frontdesk/inbox/unified";
      } else {
        const channelPath = mapChannelToPath(route.channel);
        path = `/frontdesk/inbox/${channelPath}`;
      }

      // Add query params if present (with validation)
      const queryParams = new URLSearchParams();
      const sanitizedAccountId = sanitizeId(route.accountId);
      const sanitizedConversationId = sanitizeId(route.conversationId);

      if (sanitizedAccountId) {
        queryParams.append("account", sanitizedAccountId);
      }
      if (sanitizedConversationId) {
        queryParams.append("conversation", sanitizedConversationId);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        path += `?${queryString}`;
      }
      break;
    }

    case RouteType.TICKET_LIST: {
      // Validate ticket view enum
      if (!route.view || !Object.values(TicketView).includes(route.view)) {
        console.warn("[RouteBuilder] Invalid ticket view, defaulting to ALL_TICKETS");
        path = "/frontdesk/tickets/all-tickets";
      } else {
        const viewPath = mapTicketViewToPath(route.view);
        path = `/frontdesk/tickets/${viewPath}`;
      }
      break;
    }

    case RouteType.TICKET_DETAIL: {
      const sanitizedTicketId = sanitizeId(route.ticketId);
      if (!sanitizedTicketId) {
        // Invalid ticket ID - fall back to ticket list
        console.warn("[RouteBuilder] Missing or empty ticketId, falling back to ticket list");
        path = "/frontdesk/tickets/all-tickets";
      } else {
        path = `/frontdesk/tickets/${sanitizedTicketId}`;
      }
      break;
    }

    case RouteType.SECTION: {
      // Validate section enum
      const validSections = [FrontDeskSection.ASSIGNED, FrontDeskSection.ADMIN, FrontDeskSection.SETTINGS];
      if (!route.section || !validSections.includes(route.section)) {
        console.warn("[RouteBuilder] Invalid section, defaulting to settings");
        path = "/frontdesk/settings";
      } else {
        path = `/frontdesk/${route.section}`;
      }
      break;
    }

    case RouteType.CHATWOOT: {
      path = `/frontdesk/chatwoot`;

      // Add query params for view and other options
      const queryParams = new URLSearchParams();

      // Validate and set view (with fallback to dashboard)
      const validView = route.view && Object.values(ChatwootView).includes(route.view) ? route.view : ChatwootView.DASHBOARD;
      queryParams.append("view", mapChatwootViewToQueryParam(validView));

      // Add validated IDs
      const sanitizedConversationId = sanitizeId(route.conversationId);
      const sanitizedChannelId = sanitizeId(route.channelId);

      if (sanitizedConversationId) {
        queryParams.append("conversation", sanitizedConversationId);
      }
      if (sanitizedChannelId) {
        queryParams.append("channel", sanitizedChannelId);
      }

      // Add sanitized filter parameters
      const sanitizedFilters = sanitizeFilters(route.filters);
      if (sanitizedFilters) {
        if (sanitizedFilters.status) {
          queryParams.append("status", sanitizedFilters.status);
        }
        if (sanitizedFilters.assigneeType) {
          queryParams.append("assigneeType", sanitizedFilters.assigneeType);
        }
        if (sanitizedFilters.inboxId) {
          queryParams.append("inboxId", sanitizedFilters.inboxId);
        }
        if (sanitizedFilters.teamId) {
          queryParams.append("teamId", sanitizedFilters.teamId);
        }
        if (sanitizedFilters.sortBy) {
          queryParams.append("sortBy", sanitizedFilters.sortBy);
        }
        if (sanitizedFilters.search) {
          queryParams.append("search", sanitizedFilters.search);
        }
        if (sanitizedFilters.labels) {
          queryParams.append("labels", sanitizedFilters.labels);
        }
      }

      // Add settings subpage if present and valid
      if (validView === ChatwootView.SETTINGS && route.settingsSubpage) {
        if (Object.values(ChatwootSettingsSubpage).includes(route.settingsSubpage)) {
          queryParams.append("subpage", mapChatwootSettingsSubpageToQueryParam(route.settingsSubpage));
        } else {
          console.warn("[RouteBuilder] Invalid settings subpage:", route.settingsSubpage);
        }
      }

      path += `?${queryParams.toString()}`;
      break;
    }

    default:
      console.warn("[RouteBuilder] Unknown route type, using default path");
      path = "/frontdesk/chatwoot?view=dashboard";
      break;
  }

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
    [FrontDeskChannel.CHATWOOT]: "chatwoot",
  };
  return map[channel];
};

/**
 * Map Chatwoot settings subpage enum to URL query parameter value
 */
const mapChatwootSettingsSubpageToQueryParam = (subpage: ChatwootSettingsSubpage): string => {
  const map: Record<ChatwootSettingsSubpage, string> = {
    [ChatwootSettingsSubpage.GENERAL]: "general",
    [ChatwootSettingsSubpage.AGENTS]: "agents",
    [ChatwootSettingsSubpage.INBOXES]: "inboxes",
    [ChatwootSettingsSubpage.TEAMS]: "teams",
    [ChatwootSettingsSubpage.LABELS]: "labels",
    [ChatwootSettingsSubpage.WARNINGS]: "warnings",
    [ChatwootSettingsSubpage.PROFILE]: "profile",
    [ChatwootSettingsSubpage.WEBHOOK_TEST]: "webhook-test",
    [ChatwootSettingsSubpage.OLD_FRONTDESK]: "old-frontdesk",
  };
  return map[subpage];
};

/**
 * Map Chatwoot view enum to URL query parameter value
 */
const mapChatwootViewToQueryParam = (view: ChatwootView): string => {
  const map: Record<ChatwootView, string> = {
    [ChatwootView.DASHBOARD]: "dashboard",
    [ChatwootView.MY_INBOX]: "my-inbox",
    [ChatwootView.ALL_CONVERSATIONS]: "all-conversations",
    [ChatwootView.MENTIONS]: "mentions",
    [ChatwootView.UNATTENDED]: "unattended",
    [ChatwootView.CHANNELS]: "channels",
    [ChatwootView.WEBHOOK_TEST]: "webhook-test",
    [ChatwootView.SETTINGS]: "settings",
    [ChatwootView.OAUTH_CALLBACK]: "oauth-callback",
  };
  return map[view];
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
 *
 * All factory functions sanitize their inputs and filter out empty/invalid values.
 * This ensures that built routes always produce valid URLs.
 */
export const RouteBuilder = {
  /**
   * Build inbox route (unified dashboard)
   * @returns Inbox route object
   */
  inbox: (): FrontDeskRoute => ({
    type: RouteType.INBOX,
  }),

  /**
   * Build channel route
   * @param channel - The channel type (required)
   * @param conversationId - Optional conversation ID (empty strings are filtered)
   * @param accountId - Optional account ID (empty strings are filtered)
   * @returns Channel route object
   */
  channel: (channel: FrontDeskChannel, conversationId?: string, accountId?: string): FrontDeskRoute => ({
    type: RouteType.CHANNEL,
    channel,
    conversationId: sanitizeId(conversationId),
    accountId: sanitizeId(accountId),
  }),

  /**
   * Build email channel route
   * @param conversationId - Optional conversation ID (empty strings are filtered)
   * @param accountId - Optional account ID (empty strings are filtered)
   * @returns Email channel route object
   */
  email: (conversationId?: string, accountId?: string): FrontDeskRoute => ({
    type: RouteType.CHANNEL,
    channel: FrontDeskChannel.EMAIL,
    conversationId: sanitizeId(conversationId),
    accountId: sanitizeId(accountId),
  }),

  /**
   * Build WhatsApp channel route
   * @param conversationId - Optional conversation ID (empty strings are filtered)
   * @returns WhatsApp channel route object
   */
  whatsapp: (conversationId?: string): FrontDeskRoute => RouteBuilder.channel(FrontDeskChannel.WHATSAPP, conversationId),

  /**
   * Build internal (DM) channel route
   * @param conversationId - Optional conversation ID (empty strings are filtered)
   * @returns Internal channel route object
   */
  internal: (conversationId?: string): FrontDeskRoute => RouteBuilder.channel(FrontDeskChannel.INTERNAL, conversationId),

  /**
   * Build ticket list route
   * @param view - The ticket view filter (required)
   * @returns Ticket list route object
   */
  ticketList: (view: TicketView): FrontDeskRoute => ({
    type: RouteType.TICKET_LIST,
    view,
  }),

  /**
   * Build my tickets route
   * @returns My tickets route object
   */
  myTickets: (): FrontDeskRoute => RouteBuilder.ticketList(TicketView.MY_TICKETS),

  /**
   * Build unassigned tickets route
   * @returns Unassigned tickets route object
   */
  unassignedTickets: (): FrontDeskRoute => RouteBuilder.ticketList(TicketView.UNASSIGNED),

  /**
   * Build all tickets route
   * @returns All tickets route object
   */
  allTickets: (): FrontDeskRoute => RouteBuilder.ticketList(TicketView.ALL_TICKETS),

  /**
   * Build done tickets route
   * @returns Done tickets route object
   */
  doneTickets: (): FrontDeskRoute => RouteBuilder.ticketList(TicketView.DONE),

  /**
   * Build ticket detail route
   *
   * @param ticketId - The ticket ID (required, must be non-empty)
   * @param view - Optional ticket view context to preserve when navigating back
   * @returns Ticket detail route if ticketId is valid, otherwise falls back to ticket list route
   *
   * @example
   * // Valid ticket ID
   * RouteBuilder.ticketDetail("123") // -> TicketDetailRoute
   *
   * @example
   * // Invalid ticket ID - falls back to ticket list
   * RouteBuilder.ticketDetail("") // -> TicketListRoute (with warning)
   */
  ticketDetail: (ticketId: string, view?: TicketView): FrontDeskRoute => {
    const sanitizedTicketId = sanitizeId(ticketId);

    // If ticketId is invalid, return a ticket list route instead of an invalid detail route
    // This ensures the route object is always semantically valid
    if (!sanitizedTicketId) {
      console.warn("[RouteBuilder.ticketDetail] Invalid ticketId provided, falling back to ticket list");
      return {
        type: RouteType.TICKET_LIST,
        view: view || TicketView.ALL_TICKETS,
      };
    }

    return {
      type: RouteType.TICKET_DETAIL,
      ticketId: sanitizedTicketId,
      view,
    };
  },

  /**
   * Build section route
   * @param section - The section type (required)
   * @returns Section route object
   */
  section: (section: FrontDeskSection.ASSIGNED | FrontDeskSection.ADMIN | FrontDeskSection.SETTINGS): FrontDeskRoute => ({
    type: RouteType.SECTION,
    section,
  }),

  /**
   * Build assigned section route
   * @returns Assigned section route object
   */
  assigned: (): FrontDeskRoute => RouteBuilder.section(FrontDeskSection.ASSIGNED),

  /**
   * Build admin section route
   * @returns Admin section route object
   */
  admin: (): FrontDeskRoute => RouteBuilder.section(FrontDeskSection.ADMIN),

  /**
   * Build settings section route
   * @returns Settings section route object
   */
  settings: (): FrontDeskRoute => RouteBuilder.section(FrontDeskSection.SETTINGS),

  /**
   * Build Chatwoot route with all options
   *
   * @param view - The Chatwoot view to navigate to (required)
   * @param conversationId - Optional conversation ID (empty strings are filtered)
   * @param channelId - Optional channel/inbox ID (empty strings are filtered)
   * @param filters - Optional conversation filters (empty values are filtered)
   * @param settingsSubpage - Optional settings subpage (only valid when view is SETTINGS)
   * @returns Chatwoot route object
   *
   * @example
   * // Navigate to specific conversation with filters
   * RouteBuilder.chatwoot(ChatwootView.MY_INBOX, "123", undefined, { status: "open" })
   *
   * @example
   * // Navigate to settings subpage
   * RouteBuilder.chatwoot(ChatwootView.SETTINGS, undefined, undefined, undefined, ChatwootSettingsSubpage.AGENTS)
   */
  chatwoot: (
    view: ChatwootView,
    conversationId?: string,
    channelId?: string,
    filters?: ChatwootFilters,
    settingsSubpage?: ChatwootSettingsSubpage
  ): FrontDeskRoute => ({
    type: RouteType.CHATWOOT,
    view,
    conversationId: sanitizeId(conversationId),
    channelId: sanitizeId(channelId),
    filters: sanitizeFilters(filters),
    settingsSubpage: view === ChatwootView.SETTINGS ? settingsSubpage : undefined,
  }),

  /**
   * Build Chatwoot My Inbox route
   * @returns My Inbox route object
   */
  chatwootMyInbox: (): FrontDeskRoute => RouteBuilder.chatwoot(ChatwootView.MY_INBOX),

  /**
   * Build Chatwoot All Conversations route
   * @returns All Conversations route object
   */
  chatwootAllConversations: (): FrontDeskRoute => RouteBuilder.chatwoot(ChatwootView.ALL_CONVERSATIONS),

  /**
   * Build Chatwoot Dashboard route
   * @returns Dashboard route object
   */
  chatwootDashboard: (): FrontDeskRoute => RouteBuilder.chatwoot(ChatwootView.DASHBOARD),

  /**
   * Build Chatwoot Mentions route
   * @returns Mentions route object
   */
  chatwootMentions: (): FrontDeskRoute => RouteBuilder.chatwoot(ChatwootView.MENTIONS),

  /**
   * Build Chatwoot Unattended route
   * @returns Unattended route object
   */
  chatwootUnattended: (): FrontDeskRoute => RouteBuilder.chatwoot(ChatwootView.UNATTENDED),

  /**
   * Build Chatwoot Channels route
   * @returns Channels route object
   */
  chatwootChannels: (): FrontDeskRoute => RouteBuilder.chatwoot(ChatwootView.CHANNELS),

  /**
   * Build Chatwoot Settings route
   * @param subpage - Optional settings subpage
   * @returns Settings route object
   */
  chatwootSettings: (subpage?: ChatwootSettingsSubpage): FrontDeskRoute =>
    RouteBuilder.chatwoot(ChatwootView.SETTINGS, undefined, undefined, undefined, subpage),

  /**
   * Build Chatwoot conversation route preserving current view and filters
   * Useful for navigating to a conversation while staying in the current tab
   *
   * @param view - Current view to preserve
   * @param conversationId - Conversation ID to navigate to
   * @param filters - Current filters to preserve
   * @returns Chatwoot route object with conversation selected
   */
  chatwootConversation: (view: ChatwootView, conversationId: string, filters?: ChatwootFilters): FrontDeskRoute =>
    RouteBuilder.chatwoot(view, conversationId, undefined, filters),
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
        [FrontDeskChannel.CHATWOOT]: "Chatwoot",
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

    case RouteType.CHATWOOT: {
      const viewNames = {
        [ChatwootView.DASHBOARD]: "Dashboard",
        [ChatwootView.MY_INBOX]: "My Inbox",
        [ChatwootView.ALL_CONVERSATIONS]: "All Conversations",
        [ChatwootView.MENTIONS]: "Mentions",
        [ChatwootView.UNATTENDED]: "Unattended",
        [ChatwootView.CHANNELS]: "Channels",
        [ChatwootView.WEBHOOK_TEST]: "Webhook Test",
        [ChatwootView.SETTINGS]: "Settings",
      };

      const subpageNames = {
        [ChatwootSettingsSubpage.GENERAL]: "General Settings",
        [ChatwootSettingsSubpage.AGENTS]: "Agents",
        [ChatwootSettingsSubpage.INBOXES]: "Inboxes",
        [ChatwootSettingsSubpage.TEAMS]: "Teams",
        [ChatwootSettingsSubpage.LABELS]: "Labels",
        [ChatwootSettingsSubpage.PROFILE]: "Profile Settings",
        [ChatwootSettingsSubpage.WEBHOOK_TEST]: "Webhook Test",
        [ChatwootSettingsSubpage.OLD_FRONTDESK]: "Old FrontDesk",
      };

      const title =
        route.settingsSubpage && route.view === ChatwootView.SETTINGS
          ? subpageNames[route.settingsSubpage]
          : viewNames[route.view];

      return {
        title,
        breadcrumbs: [
          "FrontDesk",
          "Chatwoot",
          viewNames[route.view],
          route.settingsSubpage ? subpageNames[route.settingsSubpage] : undefined,
        ].filter(Boolean) as string[],
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

    case RouteType.CHATWOOT:
      return a.view === (b as any).view && a.conversationId === (b as any).conversationId;

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

    case RouteType.CHATWOOT:
      return `Chatwoot: ${route.view}${route.conversationId ? ` (conversation: ${route.conversationId})` : ""}`;

    default:
      return "Unknown route";
  }
};
