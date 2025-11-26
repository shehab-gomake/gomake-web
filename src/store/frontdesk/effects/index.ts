/**
 * Frontdesk Recoil Effects
 *
 * Centralized export for all atom effects.
 */

// WebSocket effects
export {
  createChatwootWebSocketEffect,
  syncWebSocketStateEffect,
  syncWebSocketStatsEffect,
} from "./chatwoot-websocket.effect";

// Persistence effects
export {
  persistToLocalStorage,
  clearAllPersistedState,
  getPersistedKeys,
  getPersistedSize,
  dumpPersistedState,
  persistSelectedAccountEffect,
  persistSelectedInboxEffect,
  persistConversationFiltersEffect,
  persistUIPreferencesEffect,
} from "./chatwoot-persistence.effect";

export type { PersistenceOptions, UIPreferences } from "./chatwoot-persistence.effect";
export type { WebSocketEffectConfig, WebSocketEffectState } from "./chatwoot-websocket.effect";

