/**
 * External Image Control Hook
 *
 * Manages user preferences for displaying external images in emails.
 * Implements privacy-first approach:
 * - Blocks external images by default
 * - Allows user to enable per email
 * - Remembers user preference per sender (optional)
 */

import { useState, useCallback, useEffect } from 'react';

interface UseExternalImageControlOptions {
  /** Email ID (for per-email preference) */
  emailId?: string;
  /** Sender email (for per-sender preference) */
  senderEmail?: string;
  /** Whether to persist preference (default: false) */
  persist?: boolean;
}

interface ExternalImageControlState {
  /** Whether external images are currently allowed */
  allowed: boolean;
  /** Allow external images for this email */
  allowImages: () => void;
  /** Block external images for this email */
  blockImages: () => void;
  /** Toggle external images */
  toggleImages: () => void;
}

const STORAGE_KEY = 'frontdesk.email.externalImages';

interface StoredPreferences {
  /** Per-sender preferences: { "sender@example.com": true } */
  senders: Record<string, boolean>;
  /** Per-email preferences: { "email-id-123": true } */
  emails: Record<string, boolean>;
  /** Global default (default: false) */
  global: boolean;
}

/**
 * Load stored preferences from localStorage
 */
function loadPreferences(): StoredPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('[External Images] Failed to load preferences:', error);
  }

  return {
    senders: {},
    emails: {},
    global: false
  };
}

/**
 * Save preferences to localStorage
 */
function savePreferences(preferences: StoredPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn('[External Images] Failed to save preferences:', error);
  }
}

/**
 * Check if external images should be allowed based on stored preferences
 */
function shouldAllowImages(
  emailId?: string,
  senderEmail?: string
): boolean {
  const prefs = loadPreferences();

  // Check per-email preference first (most specific)
  if (emailId && prefs.emails[emailId] !== undefined) {
    return prefs.emails[emailId];
  }

  // Check per-sender preference
  if (senderEmail && prefs.senders[senderEmail] !== undefined) {
    return prefs.senders[senderEmail];
  }

  // Fall back to global default
  return prefs.global;
}

/**
 * Hook for controlling external image display in emails
 *
 * @example
 * ```tsx
 * const { allowed, allowImages } = useExternalImageControl({
 *   emailId: message.id,
 *   senderEmail: message.from[0]?.email,
 *   persist: true
 * });
 *
 * // In render:
 * <EmailFrame
 *   htmlContent={message.html}
 *   allowExternalImages={allowed}
 * />
 * <Button onClick={allowImages}>Display Images</Button>
 * ```
 */
export function useExternalImageControl(
  options: UseExternalImageControlOptions = {}
): ExternalImageControlState {
  const { emailId, senderEmail, persist = false } = options;

  // Initialize state from stored preferences
  const [allowed, setAllowed] = useState<boolean>(() =>
    shouldAllowImages(emailId, senderEmail)
  );

  // Update state when email changes
  useEffect(() => {
    setAllowed(shouldAllowImages(emailId, senderEmail));
  }, [emailId, senderEmail]);

  // Allow external images
  const allowImages = useCallback(() => {
    setAllowed(true);

    if (persist) {
      const prefs = loadPreferences();

      // Save per-email preference
      if (emailId) {
        prefs.emails[emailId] = true;
      }

      // Save per-sender preference
      if (senderEmail) {
        prefs.senders[senderEmail] = true;
      }

      savePreferences(prefs);
    }
  }, [emailId, senderEmail, persist]);

  // Block external images
  const blockImages = useCallback(() => {
    setAllowed(false);

    if (persist) {
      const prefs = loadPreferences();

      // Remove preferences
      if (emailId && prefs.emails[emailId]) {
        delete prefs.emails[emailId];
      }

      if (senderEmail && prefs.senders[senderEmail]) {
        delete prefs.senders[senderEmail];
      }

      savePreferences(prefs);
    }
  }, [emailId, senderEmail, persist]);

  // Toggle external images
  const toggleImages = useCallback(() => {
    if (allowed) {
      blockImages();
    } else {
      allowImages();
    }
  }, [allowed, allowImages, blockImages]);

  return {
    allowed,
    allowImages,
    blockImages,
    toggleImages
  };
}

/**
 * Hook for global external image preference
 * Useful for settings page
 */
export function useGlobalExternalImagePreference(): {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  clearAllPreferences: () => void;
} {
  const [enabled, setEnabledState] = useState<boolean>(() => {
    const prefs = loadPreferences();
    return prefs.global;
  });

  const setEnabled = useCallback((newEnabled: boolean) => {
    setEnabledState(newEnabled);
    const prefs = loadPreferences();
    prefs.global = newEnabled;
    savePreferences(prefs);
  }, []);

  const clearAllPreferences = useCallback(() => {
    savePreferences({
      senders: {},
      emails: {},
      global: false
    });
    setEnabledState(false);
  }, []);

  return {
    enabled,
    setEnabled,
    clearAllPreferences
  };
}

/**
 * Get statistics about external image preferences
 * Useful for debugging and analytics
 */
export function getExternalImageStats(): {
  trustedSenders: number;
  trustedEmails: number;
  globalEnabled: boolean;
} {
  const prefs = loadPreferences();

  return {
    trustedSenders: Object.keys(prefs.senders).filter(email => prefs.senders[email]).length,
    trustedEmails: Object.keys(prefs.emails).filter(id => prefs.emails[id]).length,
    globalEnabled: prefs.global
  };
}
