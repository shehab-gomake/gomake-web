/**
 * Chatwoot Service - Main Aggregator
 *
 * This is the main service class that aggregates all Chatwoot API services.
 * It provides a single entry point with organized sub-services for each API group.
 *
 * Usage:
 * ```typescript
 * import { chatwootService } from '@/services/frontdesk';
 *
 * // Profile operations
 * const user = await chatwootService.profile.getProfile();
 *
 * // Conversation operations
 * const conversations = await chatwootService.conversations.listConversations(accountId);
 *
 * // Contact operations
 * const contacts = await chatwootService.contacts.listContacts(accountId);
 *
 * // Message operations
 * const messages = await chatwootService.messages.listMessages(accountId, conversationId);
 *
 * // Agent operations
 * const agents = await chatwootService.agents.listAgents(accountId);
 *
 * // Inbox operations
 * const inboxes = await chatwootService.inboxes.listAllInboxes();
 *
 * // Team operations
 * const teams = await chatwootService.teams.listTeams(accountId);
 *
 * // Label operations
 * const labels = await chatwootService.labels.listLabels(accountId);
 *
 * // Notification operations
 * const notifications = await chatwootService.notifications.listNotifications(accountId, { page: 1, sort_order: 'desc' });
 * ```
 */

import config from "@/config";
import { ChatwootProfileService } from "./services/chatwoot-profile.service";
import { ChatwootConversationsService } from "./services/chatwoot-conversations.service";
import { ChatwootInboxesService } from "./services/chatwoot-inboxes.service";
import { ChatwootContactsService } from "./services/chatwoot-contacts.service";
import { ChatwootMessagesService } from "./services/chatwoot-messages.service";
import { ChatwootNotificationsService } from "./services/chatwoot-notifications.service";
import { ChatwootAgentsService } from "./services/chatwoot-agents.service";
import { ChatwootTeamsService } from "./services/chatwoot-teams.service";
import { ChatwootLabelsService } from "./services/chatwoot-labels.service";
import { ChatwootOAuthService } from "./services/chatwoot-oauth.service";

/**
 * ChatwootService
 *
 * Main aggregator service that provides access to all Chatwoot API groups.
 * Each property is an instance of the corresponding service class.
 */
export class ChatwootService {
  /**
   * Profile service
   * Handles user profile endpoints that don't require account_id
   */
  public readonly profile: ChatwootProfileService;

  /**
   * Conversations service
   * Handles all conversation-related endpoints
   */
  public readonly conversations: ChatwootConversationsService;

  /**
   * Contacts service
   * Handles all contact-related endpoints
   */
  public readonly contacts: ChatwootContactsService;

  /**
   * Messages service
   * Handles all message-related endpoints
   */
  public readonly messages: ChatwootMessagesService;

  /**
   * Agents service
   * Handles all agent-related endpoints
   */
  public readonly agents: ChatwootAgentsService;

  /**
   * Inboxes service
   * Handles all inbox (channel) related endpoints
   */
  public readonly inboxes: ChatwootInboxesService;

  /**
   * Teams service
   * Handles all team-related endpoints
   */
  public readonly teams: ChatwootTeamsService;

  /**
   * Labels service
   * Handles all label-related endpoints
   */
  public readonly labels: ChatwootLabelsService;

  /**
   * Notifications service
   * Handles all notification-related endpoints
   */
  public readonly notifications: ChatwootNotificationsService;

  /**
   * OAuth service
   * Handles OAuth authorization for channel connections (Gmail/Outlook)
   */
  public readonly oauth: ChatwootOAuthService;

  /**
   * Base URL for Chatwoot API (default: http://localhost:8080)
   */
  private readonly baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8080") {
    this.baseUrl = baseUrl;

    // Initialize all service instances
    this.profile = new ChatwootProfileService(this.baseUrl);
    this.conversations = new ChatwootConversationsService(this.baseUrl);
    this.inboxes = new ChatwootInboxesService(this.baseUrl);
    this.contacts = new ChatwootContactsService(this.baseUrl);
    this.messages = new ChatwootMessagesService(this.baseUrl);
    this.notifications = new ChatwootNotificationsService(this.baseUrl);
    this.agents = new ChatwootAgentsService(this.baseUrl);
    this.teams = new ChatwootTeamsService(this.baseUrl);
    this.labels = new ChatwootLabelsService(this.baseUrl);
    this.oauth = new ChatwootOAuthService();
  }
}

/**
 * Default singleton instance
 * Use this for convenience instead of creating new instances
 * Uses environment variable CHATWOOT_SERVER or defaults to http://localhost:8080
 */
export const chatwootService = new ChatwootService(config.chatwoot_server || "http://localhost:8080");
