/**
 * Unified Avatar Utility for Chatwoot Provider
 *
 * Centralizes all avatar generation logic for consistent display across:
 * - Contacts (conversation senders/receivers)
 * - Agents (team members)
 * - Users (profile)
 * - Notifications (activity feed)
 * - Teams (group avatars)
 *
 * Best Practices:
 * 1. Always use these utilities instead of inline avatar logic
 * 2. Pass the full entity object to preserve context
 * 3. Use type-specific functions for better type safety
 * 4. Consistent color generation based on stable identifiers
 */

import { generateAvatarData as generateBasicAvatarData } from "@/widgets/frontdesk/utils/avatar.utils";

// ============================================================================
// Constants
// ============================================================================

/**
 * Extended color palette specifically for Chatwoot entities
 * Includes more vibrant colors for better visual distinction
 */
export const CHATWOOT_AVATAR_COLORS = [
  "#1976D2", // Primary blue
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
] as const;

/**
 * Default avatar sizes for different contexts
 */
export const AVATAR_SIZES = {
  xs: { width: 16, height: 16, fontSize: "0.563rem" },
  sm: { width: 24, height: 24, fontSize: "0.65rem" },
  md: { width: 32, height: 32, fontSize: "0.75rem" },
  lg: { width: 40, height: 40, fontSize: "0.875rem" },
  xl: { width: 48, height: 48, fontSize: "1rem" },
} as const;

// ============================================================================
// Core Avatar Data Interface
// ============================================================================

/**
 * Standardized avatar data structure
 */
export interface AvatarData {
  /** Display initials (1-2 characters) */
  initials: string;
  /** Background color (hex) */
  backgroundColor: string;
  /** Avatar image URL (optional) */
  src?: string;
  /** Display name for tooltip/accessibility */
  displayName: string;
  /** Online/busy/offline status (optional) */
  presence?: "online" | "busy" | "offline" | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generates initials from a name
 * @param name - Full name or display name
 * @returns Up to 2 uppercase characters
 */
function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "??";

  const trimmed = name.trim();
  if (!trimmed) return "??";

  const words = trimmed.split(/\s+/);

  if (words.length === 1) {
    // Single word: take first 2 chars
    return words[0].substring(0, 2).toUpperCase();
  }

  // Multiple words: take first char of first 2 words
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Generates a consistent color based on an identifier
 * @param identifier - Stable identifier (email, id, name)
 * @param colorPalette - Custom color palette (optional)
 * @returns Hex color string
 */
function getConsistentColor(
  identifier: string,
  colorPalette: readonly string[] = CHATWOOT_AVATAR_COLORS
): string {
  if (!identifier || typeof identifier !== "string") return colorPalette[0];

  // Simple hash function for consistent color selection
  const hash = identifier.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
}

/**
 * Extracts the best identifier for color generation
 * Priority: id > email > name
 */
function getBestIdentifier(data: {
  id?: string | number | null;
  email?: string | null;
  name?: string | null;
}): string {
  return String(data.id || data.email || data.name || "unknown");
}

// ============================================================================
// Entity-Specific Avatar Generators
// ============================================================================

/**
 * Generate avatar data for a Chatwoot contact (conversation sender/receiver)
 *
 * @example
 * ```typescript
 * const avatarData = generateContactAvatar(conversation.meta.sender);
 * <Avatar src={avatarData.src} sx={{ bgcolor: avatarData.backgroundColor }}>
 *   {avatarData.initials}
 * </Avatar>
 * ```
 */
export function generateContactAvatar(contact: {
  id?: number | null;
  name?: string | null;
  email?: string | null;
  thumbnail?: string | null;
  avatar_url?: string | null;
  availability_status?: string | null;
}): AvatarData {
  const displayName = contact.name || contact.email || "Unknown Contact";
  const identifier = getBestIdentifier({
    id: contact.id?.toString(),
    email: contact.email,
    name: contact.name,
  });

  return {
    initials: getInitials(displayName),
    backgroundColor: getConsistentColor(identifier),
    src: contact.thumbnail || contact.avatar_url || undefined,
    displayName,
    presence: (contact.availability_status as AvatarData["presence"]) || null,
  };
}

/**
 * Generate avatar data for a Chatwoot agent (team member)
 *
 * @example
 * ```typescript
 * const avatarData = generateAgentAvatar(assignee);
 * <Avatar src={avatarData.src} sx={{ bgcolor: avatarData.backgroundColor }}>
 *   {avatarData.initials}
 * </Avatar>
 * ```
 */
export function generateAgentAvatar(agent: {
  id?: number | null;
  name?: string | null;
  available_name?: string | null;
  email?: string | null;
  thumbnail?: string | null;
  avatar_url?: string | null;
  availability_status?: string | null;
}): AvatarData {
  const displayName = agent.name || agent.available_name || agent.email || "Agent";
  const identifier = getBestIdentifier({
    id: agent.id?.toString(),
    email: agent.email,
    name: agent.name,
  });

  return {
    initials: getInitials(displayName),
    backgroundColor: getConsistentColor(identifier),
    src: agent.thumbnail || agent.avatar_url || undefined,
    displayName,
    presence: (agent.availability_status as AvatarData["presence"]) || null,
  };
}

/**
 * Generate avatar data for a Chatwoot user (current user profile)
 *
 * @example
 * ```typescript
 * const avatarData = generateUserAvatar(profile);
 * <Avatar src={avatarData.src} sx={{ bgcolor: avatarData.backgroundColor }}>
 *   {avatarData.initials}
 * </Avatar>
 * ```
 */
export function generateUserAvatar(user: {
  id?: number | null;
  name?: string | null;
  available_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  availability_status?: string | null;
}): AvatarData {
  const displayName = user.name || user.available_name || user.email || "User";
  const identifier = getBestIdentifier({
    id: user.id?.toString(),
    email: user.email,
    name: user.name,
  });

  return {
    initials: getInitials(displayName),
    backgroundColor: getConsistentColor(identifier),
    src: user.avatar_url || undefined,
    displayName,
    presence: (user.availability_status as AvatarData["presence"]) || null,
  };
}

/**
 * Generate avatar data for a notification sender
 * (handles complex notification actor structures)
 *
 * @example
 * ```typescript
 * const avatarData = generateNotificationAvatar(notification);
 * <Avatar src={avatarData.src} sx={{ bgcolor: avatarData.backgroundColor }}>
 *   {avatarData.initials}
 * </Avatar>
 * ```
 */
export function generateNotificationAvatar(notification: {
  primary_actor?: any;
  secondary_actor?: any;
}): AvatarData {
  const primaryActor = notification.primary_actor;
  const secondaryActor = notification.secondary_actor;

  // Priority order for name extraction (same as notification-formatters.ts)
  const name =
    secondaryActor?.name ||
    secondaryActor?.email ||
    primaryActor?.meta?.sender?.name ||
    primaryActor?.meta?.sender?.email ||
    secondaryActor?.sender?.name ||
    secondaryActor?.sender?.email ||
    primaryActor?.name ||
    primaryActor?.email ||
    "Unknown";

  // Priority order for avatar URL
  const avatarUrl =
    secondaryActor?.thumbnail ||
    secondaryActor?.avatar_url ||
    secondaryActor?.sender?.thumbnail ||
    primaryActor?.meta?.sender?.thumbnail ||
    primaryActor?.avatar_url ||
    undefined;

  // Priority order for identifier
  const identifier =
    secondaryActor?.id?.toString() ||
    secondaryActor?.email ||
    primaryActor?.id?.toString() ||
    primaryActor?.email ||
    name;

  return {
    initials: getInitials(name),
    backgroundColor: getConsistentColor(identifier),
    src: avatarUrl,
    displayName: name,
    presence: null,
  };
}

/**
 * Generate avatar data for a team
 *
 * @example
 * ```typescript
 * const avatarData = generateTeamAvatar(team);
 * <Avatar sx={{ bgcolor: avatarData.backgroundColor }}>
 *   {avatarData.initials}
 * </Avatar>
 * ```
 */
export function generateTeamAvatar(team: {
  id?: number | null;
  name?: string | null;
}): AvatarData {
  const displayName = team.name || "Team";
  const identifier = getBestIdentifier({
    id: team.id?.toString(),
    name: team.name,
    email: null,
  });

  return {
    initials: getInitials(displayName),
    backgroundColor: getConsistentColor(identifier),
    src: undefined, // Teams typically don't have avatars
    displayName,
    presence: null,
  };
}

/**
 * Generate avatar data for message sender
 * (specialized for message bubbles with sender context)
 *
 * @example
 * ```typescript
 * const avatarData = generateMessageSenderAvatar(message.sender);
 * <Avatar src={avatarData.src} sx={{ bgcolor: avatarData.backgroundColor }}>
 *   {avatarData.initials}
 * </Avatar>
 * ```
 */
export function generateMessageSenderAvatar(sender: {
  id?: number | null;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  thumbnail?: string | null;
  availability_status?: string | null;
}): AvatarData {
  const displayName = sender.name || sender.email || "Sender";
  const identifier = getBestIdentifier({
    id: sender.id?.toString(),
    email: sender.email,
    name: sender.name,
  });

  return {
    initials: getInitials(displayName),
    backgroundColor: getConsistentColor(identifier),
    src: sender.avatar_url || sender.thumbnail || undefined,
    displayName,
    presence: (sender.availability_status as AvatarData["presence"]) || null,
  };
}

// ============================================================================
// Utility Exports (for backward compatibility)
// ============================================================================

/**
 * Get avatar color for a given identifier
 * @deprecated Use entity-specific functions instead
 */
export function getAvatarColor(identifier: string): string {
  return getConsistentColor(identifier);
}

/**
 * Get initials for a name
 * @deprecated Use entity-specific functions instead
 */
export function getAvatarInitials(name: string): string {
  return getInitials(name);
}

/**
 * Generic avatar data generator
 * @deprecated Use entity-specific functions instead (generateContactAvatar, generateAgentAvatar, etc.)
 */
export function generateChatwootAvatarData(entity: {
  id?: string | number | null;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  thumbnail?: string | null;
}): AvatarData {
  const displayName = entity.name || entity.email || "Unknown";
  const identifier = getBestIdentifier({
    id: entity.id?.toString(),
    email: entity.email,
    name: entity.name,
  });

  return {
    initials: getInitials(displayName),
    backgroundColor: getConsistentColor(identifier),
    src: entity.avatar_url || entity.thumbnail || undefined,
    displayName,
    presence: null,
  };
}

// ============================================================================
// Presence Indicator Helper
// ============================================================================

/**
 * Get color for presence status
 */
export function getPresenceColor(status: string | null | undefined): string {
  switch (status) {
    case "online":
      return "#22C55E"; // Green-500
    case "busy":
      return "#F59E0B"; // Amber-500
    case "offline":
    default:
      return "#6B7280"; // Gray-500
  }
}

/**
 * Check if presence indicator should be shown
 */
export function shouldShowPresence(status: string | null | undefined): boolean {
  return status === "online" || status === "busy";
}

