/**
 * Chatwoot Types
 * Centralized export for all Chatwoot API types
 *
 * Types are organized by domain:
 * - profile.types.ts - User profile and authentication types
 * - conversations.types.ts - Conversation and conversation list types
 * - messages.types.ts - Message and message creation types
 * - contacts.types.ts - Contact management types
 * - agents.types.ts - Agent and agent bot types
 * - teams.types.ts - Team management types
 * - inboxes.types.ts - Inbox/channel configuration types
 * - labels.types.ts - Label management types
 * - notifications.types.ts - Notification types
 * - enums.types.ts - All enum types for convenience
 */

// Core domain types
export * from "./profile.types";
export * from "./conversations.types";
export * from "./messages.types";
export * from "./contacts.types";
export * from "./agents.types";
export * from "./teams.types";
export * from "./inboxes.types";
export * from "./labels.types";
export * from "./notifications.types";

// Enums for convenience
export * from "./enums.types";
