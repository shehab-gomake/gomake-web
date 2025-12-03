/**
 * FrontDesk Routing Types
 *
 * Centralized type definitions for the FrontDesk routing system.
 * This file serves as the single source of truth for all routing-related types.
 */

/**
 * Main navigation sections in FrontDesk
 */
export enum FrontDeskSection {
  INBOX = "inbox",
  ASSIGNED = "assigned",
  ADMIN = "admin",
  SETTINGS = "settings",
}

/**
 * Communication channels/providers
 */
export enum FrontDeskChannel {
  ALL = "all", // Unified view
  EMAIL = "email", // Email provider
  WHATSAPP = "whatsapp", // WhatsApp provider
  INTERNAL = "internal", // Direct Messages
  CHATWOOT = "chatwoot", // Chatwoot integration
}

/**
 * Ticket view filters
 */
export enum TicketView {
  MY_TICKETS = "my-tickets",
  UNASSIGNED = "unassigned",
  ALL_TICKETS = "all-tickets",
  DONE = "done",
  ARCHIVED = "archived",
}

/**
 * Route type discriminator for type-safe navigation
 */
export enum RouteType {
  INBOX = "inbox",
  CHANNEL = "channel",
  TICKET_LIST = "ticket-list",
  TICKET_DETAIL = "ticket-detail",
  SECTION = "section",
  CHATWOOT = "chatwoot",
}

/**
 * Base route parameters shared across all routes
 */
interface BaseRouteParams {
  type: RouteType;
}

/**
 * Inbox route (unified dashboard view)
 */
export interface InboxRoute extends BaseRouteParams {
  type: RouteType.INBOX;
}

/**
 * Channel route (specific provider view)
 */
export interface ChannelRoute extends BaseRouteParams {
  type: RouteType.CHANNEL;
  channel: FrontDeskChannel;
  conversationId?: string;
  accountId?: string; // For email provider: which account owns this conversation
}

/**
 * Ticket list route (filtered ticket view)
 */
export interface TicketListRoute extends BaseRouteParams {
  type: RouteType.TICKET_LIST;
  view: TicketView;
}

/**
 * Ticket detail route (specific ticket)
 */
export interface TicketDetailRoute extends BaseRouteParams {
  type: RouteType.TICKET_DETAIL;
  ticketId: string;
  view?: TicketView; // Optional: which view was selected before opening ticket
}

/**
 * Section route (assigned, admin, settings)
 */
export interface SectionRoute extends BaseRouteParams {
  type: RouteType.SECTION;
  section: FrontDeskSection.ASSIGNED | FrontDeskSection.ADMIN | FrontDeskSection.SETTINGS;
}

/**
 * Chatwoot view types
 */
export enum ChatwootView {
  DASHBOARD = "dashboard",
  MY_INBOX = "my-inbox",
  ALL_CONVERSATIONS = "all-conversations",
  MENTIONS = "mentions",
  UNATTENDED = "unattended",
  CHANNELS = "channels",
  WORKBOARD = "workboard",
  WEBHOOK_TEST = "webhook-test",
  SETTINGS = "settings",
  OAUTH_CALLBACK = "oauth-callback",
}

/**
 * Chatwoot conversation filters (for URL persistence)
 */
export interface ChatwootFilters {
  /** Filter by status (open, resolved, pending, snoozed) */
  status?: string;
  /** Filter by assignee type (me, unassigned, all) */
  assigneeType?: string;
  /** Filter by inbox ID */
  inboxId?: string;
  /** Filter by team ID */
  teamId?: string;
  /** Sort order */
  sortBy?: string;
  /** Search query */
  search?: string;
  /** Filter by labels (comma-separated) */
  labels?: string;
}

/**
 * Chatwoot settings subpage types
 */
export enum ChatwootSettingsSubpage {
  GENERAL = "general",
  AGENTS = "agents",
  INBOXES = "inboxes",
  TEAMS = "teams",
  LABELS = "labels",
  WARNINGS = "warnings",
  PROFILE = "profile",
  WEBHOOK_TEST = "webhook-test",
  OLD_FRONTDESK = "old-frontdesk",
}

/**
 * Chatwoot route
 */
export interface ChatwootRoute extends BaseRouteParams {
  type: RouteType.CHATWOOT;
  view: ChatwootView;
  conversationId?: string;
  channelId?: string;
  /** Optional filters for conversation list */
  filters?: ChatwootFilters;
  /** Optional settings subpage (only valid when view is SETTINGS) */
  settingsSubpage?: ChatwootSettingsSubpage;
}

/**
 * Union type of all possible routes
 */
export type FrontDeskRoute = InboxRoute | ChannelRoute | TicketListRoute | TicketDetailRoute | SectionRoute | ChatwootRoute;

/**
 * Query parameters that can be passed via URL
 * Used for deep linking from notifications, etc.
 */
export interface RouteQueryParams {
  // From notifications - direct view override
  view?: string;
  // From notifications - specific ticket
  ticket?: string;
  // From notifications - specific conversation
  conversation?: string;
}

/**
 * Parsed route state including URL params and query params
 */
export interface ParsedRoute {
  route: FrontDeskRoute;
  queryParams: RouteQueryParams;
}

/**
 * Navigation options
 */
export interface NavigationOptions {
  /** Replace current history entry instead of pushing new one */
  replace?: boolean;
  /** Scroll to top after navigation */
  scroll?: boolean;
  /** Open in new tab */
  newTab?: boolean;
}

/**
 * Route metadata for display purposes
 */
export interface RouteMetadata {
  title: string;
  breadcrumbs: string[];
  icon?: string;
}

/**
 * Legacy types for backward compatibility
 * These map to the new enum types
 */
export type Channel = "all" | "email" | "whatsapp" | "internal" | "chatwoot";
export type Section = "inbox" | "assigned" | "admin" | "settings";
export type TicketViewLegacy = "my-tickets" | "unassigned" | "all-tickets" | "done" | "archived";

/**
 * Type guards for route discrimination
 */
export const isInboxRoute = (route: FrontDeskRoute): route is InboxRoute => route.type === RouteType.INBOX;

export const isChannelRoute = (route: FrontDeskRoute): route is ChannelRoute => route.type === RouteType.CHANNEL;

export const isTicketListRoute = (route: FrontDeskRoute): route is TicketListRoute => route.type === RouteType.TICKET_LIST;

export const isTicketDetailRoute = (route: FrontDeskRoute): route is TicketDetailRoute => route.type === RouteType.TICKET_DETAIL;

export const isSectionRoute = (route: FrontDeskRoute): route is SectionRoute => route.type === RouteType.SECTION;

export const isChatwootRoute = (route: FrontDeskRoute): route is ChatwootRoute => route.type === RouteType.CHATWOOT;

/**
 * Utility to convert legacy types to new enums
 */
export const mapLegacyChannel = (channel: Channel): FrontDeskChannel => {
  const map: Record<Channel, FrontDeskChannel> = {
    all: FrontDeskChannel.ALL,
    email: FrontDeskChannel.EMAIL,
    whatsapp: FrontDeskChannel.WHATSAPP,
    internal: FrontDeskChannel.INTERNAL,
    chatwoot: FrontDeskChannel.CHATWOOT,
  };
  return map[channel];
};

export const mapLegacySection = (section: Section): FrontDeskSection => {
  const map: Record<Section, FrontDeskSection> = {
    inbox: FrontDeskSection.INBOX,
    assigned: FrontDeskSection.ASSIGNED,
    admin: FrontDeskSection.ADMIN,
    settings: FrontDeskSection.SETTINGS,
  };
  return map[section];
};

export const mapLegacyTicketView = (view: TicketViewLegacy): TicketView => {
  const map: Record<TicketViewLegacy, TicketView> = {
    "my-tickets": TicketView.MY_TICKETS,
    unassigned: TicketView.UNASSIGNED,
    "all-tickets": TicketView.ALL_TICKETS,
    done: TicketView.DONE,
    archived: TicketView.ARCHIVED,
  };
  return map[view];
};
