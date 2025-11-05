/**
 * Chatwoot Services
 * Centralized export for all Chatwoot API service classes
 *
 * Each service handles a specific API group:
 * - ProfileService - User profile endpoints
 * - ConversationsService - Conversation management
 * - InboxesService - Inbox (channel) management
 * - ContactsService - Contact management
 * - MessagesService - Message operations
 * - NotificationsService - Notification operations
 * - AgentsService - Agent management
 * - TeamsService - Team management
 * - LabelsService - Label management
 * - OAuthService - OAuth authorization for channel connections
 */

export * from "./chatwoot-profile.service";
export * from "./chatwoot-conversations.service";
export * from "./chatwoot-inboxes.service";
export * from "./chatwoot-contacts.service";
export * from "./chatwoot-messages.service";
export * from "./chatwoot-notifications.service";
export * from "./chatwoot-agents.service";
export * from "./chatwoot-teams.service";
export * from "./chatwoot-labels.service";
export * from "./chatwoot-oauth.service";

