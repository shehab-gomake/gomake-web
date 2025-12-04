/**
 * Chatwoot Persistence Atom Effects
 *
 * Persists selected Recoil atoms to localStorage for session continuity.
 * Handles versioning for migration safety.
 *
 * Usage:
 * Add persistToLocalStorage effect to atoms that should be persisted.
 *
 * @example
 * ```typescript
 * export const chatwootSelectedAccountAtom = atom<number | null>({
 *   key: 'frontdesk.chatwoot.selectedAccount',
 *   default: null,
 *   effects: [persistToLocalStorage('chatwoot.selectedAccount')],
 * });
 * ```
 */

import { AtomEffect, DefaultValue } from "recoil";

// ============================================================================
// CONSTANTS
// ============================================================================

/** Prefix for all persisted keys */
const STORAGE_PREFIX = "chatwoot_state_";

/** Current persistence version - increment when data structure changes */
const PERSISTENCE_VERSION = 1;

/** Version key in storage */
const VERSION_KEY = `${STORAGE_PREFIX}version`;

// ============================================================================
// TYPES
// ============================================================================

export interface PersistenceOptions<T> {
  /** Custom serializer (default: JSON.stringify) */
  serialize?: (value: T) => string;
  /** Custom deserializer (default: JSON.parse) */
  deserialize?: (stored: string) => T;
  /** Validator to check if persisted data is still valid */
  validate?: (value: T) => boolean;
  /** Migration function when version changes */
  migrate?: (oldValue: unknown, oldVersion: number) => T | null;
  /** TTL in milliseconds (optional) */
  ttl?: number;
  /** Skip persistence in SSR */
  skipSSR?: boolean;
}

interface PersistedData<T> {
  value: T;
  version: number;
  timestamp: number;
}

// ============================================================================
// PERSISTENCE EFFECT
// ============================================================================

/**
 * Creates a Recoil atom effect that persists the atom value to localStorage
 *
 * @param key - Storage key (will be prefixed with STORAGE_PREFIX)
 * @param options - Persistence options
 * @returns Recoil AtomEffect
 */
export function persistToLocalStorage<T>(key: string, options: PersistenceOptions<T> = {}): AtomEffect<T> {
  const { serialize = JSON.stringify, deserialize = JSON.parse, validate, migrate, ttl, skipSSR = true } = options;

  const storageKey = `${STORAGE_PREFIX}${key}`;

  return ({ setSelf, onSet, trigger }) => {
    // Skip in SSR
    if (skipSSR && typeof window === "undefined") {
      return;
    }

    // Load persisted value on initialization
    if (trigger === "get") {
      const storedValue = loadFromStorage<T>(storageKey, deserialize, validate, migrate, ttl);
      if (storedValue !== null) {
        setSelf(storedValue);
      }
    }

    // Persist on changes
    onSet((newValue, _, isReset) => {
      if (isReset || newValue instanceof DefaultValue) {
        removeFromStorage(storageKey);
      } else {
        saveToStorage(storageKey, newValue, serialize);
      }
    });
  };
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

/**
 * Save value to localStorage with metadata
 *
 * The wrapper structure (PersistedData) is always JSON serialized.
 * The custom `serialize` function is applied only to the inner value.
 * This ensures loadFromStorage can properly deserialize with custom deserializers.
 */
function saveToStorage<T>(key: string, value: T, serialize: (value: T) => string): void {
  try {
    // Serialize the inner value using custom serializer
    const serializedValue = serialize(value);

    // Wrap with metadata - wrapper is always JSON
    const wrapper = {
      value: serializedValue,
      version: PERSISTENCE_VERSION,
      timestamp: Date.now(),
    };

    localStorage.setItem(key, JSON.stringify(wrapper));
  } catch (error) {
    console.warn(`[Persistence] Failed to save ${key}:`, error);
  }
}

/**
 * Load value from localStorage with validation
 *
 * The wrapper (PersistedData) is always JSON-parsed.
 * The custom `deserialize` function is applied to the inner value string.
 *
 * Since saveToStorage serializes the inner value to a string, rawData.value
 * will always be a string when loaded, and deserialize will always be called.
 */
function loadFromStorage<T>(
  key: string,
  deserialize: (stored: string) => T,
  validate?: (value: T) => boolean,
  migrate?: (oldValue: unknown, oldVersion: number) => T | null,
  ttl?: number
): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    // Parse the wrapper structure (always JSON)
    const rawData = JSON.parse(stored);

    // The inner value was serialized to a string by saveToStorage,
    // so we deserialize it with the custom deserializer.
    // For backwards compatibility, handle cases where value might not be a string
    // (e.g., data saved before this fix).
    const deserializedValue: T = typeof rawData.value === "string" ? deserialize(rawData.value) : (rawData.value as T);

    const data: PersistedData<T> = {
      value: deserializedValue,
      version: rawData.version ?? PERSISTENCE_VERSION,
      timestamp: rawData.timestamp ?? 0,
    };

    // Check TTL
    if (ttl && data.timestamp > 0 && Date.now() - data.timestamp > ttl) {
      console.log(`[Persistence] ${key} expired (TTL: ${ttl}ms)`);
      removeFromStorage(key);
      return null;
    }

    // Check version and migrate if needed
    if (data.version !== PERSISTENCE_VERSION) {
      if (migrate) {
        const migrated = migrate(data.value, data.version);
        if (migrated !== null) {
          console.log(`[Persistence] Migrated ${key} from v${data.version} to v${PERSISTENCE_VERSION}`);
          return migrated;
        }
      }
      console.log(`[Persistence] ${key} version mismatch, clearing`);
      removeFromStorage(key);
      return null;
    }

    // Validate
    if (validate && !validate(data.value)) {
      console.log(`[Persistence] ${key} failed validation, clearing`);
      removeFromStorage(key);
      return null;
    }

    return data.value;
  } catch (error) {
    console.warn(`[Persistence] Failed to load ${key}:`, error);
    removeFromStorage(key);
    return null;
  }
}

/**
 * Remove value from localStorage
 */
function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Persistence] Failed to remove ${key}:`, error);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear all persisted Chatwoot state
 */
export function clearAllPersistedState(): void {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
  console.log(`[Persistence] Cleared ${keysToRemove.length} persisted keys`);
}

/**
 * Get all persisted keys
 */
export function getPersistedKeys(): string[] {
  if (typeof window === "undefined") return [];

  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keys.push(key.replace(STORAGE_PREFIX, ""));
    }
  }
  return keys;
}

/**
 * Get total size of persisted data
 */
export function getPersistedSize(): number {
  if (typeof window === "undefined") return 0;

  let totalSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += key.length + value.length;
      }
    }
  }
  return totalSize;
}

/**
 * Debug utility: dump all persisted state
 */
export function dumpPersistedState(): Record<string, unknown> {
  if (typeof window === "undefined") return {};

  const state: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          state[key.replace(STORAGE_PREFIX, "")] = JSON.parse(value);
        }
      } catch {
        state[key.replace(STORAGE_PREFIX, "")] = "PARSE_ERROR";
      }
    }
  }
  return state;
}

// ============================================================================
// PREDEFINED EFFECTS FOR COMMON ATOMS
// ============================================================================

/**
 * Effect for persisting selected account ID
 */
export const persistSelectedAccountEffect = persistToLocalStorage<number | null>("selectedAccount", {
  validate: (value) => value === null || typeof value === "number",
});

/**
 * Effect for persisting selected inbox ID
 */
export const persistSelectedInboxEffect = persistToLocalStorage<number | null>("selectedInboxId", {
  validate: (value) => value === null || typeof value === "number",
});

/**
 * Effect for persisting conversation filters
 */
export const persistConversationFiltersEffect = persistToLocalStorage<Record<string, unknown>>("conversationFilters", {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  validate: (value) => typeof value === "object" && value !== null,
});

/**
 * Effect for persisting UI preferences
 */
export interface UIPreferences {
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  listView: "compact" | "comfortable";
}

export const persistUIPreferencesEffect = persistToLocalStorage<UIPreferences>("uiPreferences", {
  validate: (value) =>
    typeof value === "object" &&
    value !== null &&
    typeof value.sidebarCollapsed === "boolean" &&
    ["light", "dark", "system"].includes(value.theme) &&
    ["compact", "comfortable"].includes(value.listView),
});

// ============================================================================
// EXPORTS
// ============================================================================

export default persistToLocalStorage;
