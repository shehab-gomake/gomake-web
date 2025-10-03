import { DMPresenceData } from '../types/direct-messages.types';

/**
 * Validates that a userId is legitimate (not '0', '1', null, etc.)
 */
export function isValidUserId(userId: any): boolean {
  return (
    userId &&
    typeof userId === 'string' &&
    userId !== '0' &&
    userId !== '1' &&
    userId.length > 2 // Real UUIDs are longer
  );
}

/**
 * Parses presence response from various formats into a normalized object
 * Handles both array and object responses from the backend
 */
export function parsePresenceResponse(
  response: Record<string, DMPresenceData> | null | undefined
): {
  presenceData: Record<string, DMPresenceData>;
  onlineUserIds: string[];
} {
  const presenceData: Record<string, DMPresenceData> = {};
  const onlineUserIds: string[] = [];

  if (!response || typeof response !== 'object') {
    return { presenceData, onlineUserIds };
  }

  Object.entries(response).forEach(([userId, userData]) => {
    if (isValidUserId(userId) && userData) {
      presenceData[userId] = userData;
      if (userData.status === 'online') {
        onlineUserIds.push(userId);
      }
    }
  });

  return { presenceData, onlineUserIds };
}

/**
 * Parses status change events from various backend formats
 */
export function parseStatusChangeEvent(event: any): {
  userId?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  userData: any;
} {
  if (!event || typeof event !== 'object') {
    return { userData: {} };
  }

  // Canonical presence:update payload already contains the user data we need
  if (event.userId && event.status) {
    return { userId: event.userId, status: event.status, userData: event };
  }

  // Some transports wrap payloads under `data`
  if (event.data && event.data.userId && event.data.status) {
    return { userId: event.data.userId, status: event.data.status, userData: event.data };
  }

  return { userData: event };
}
