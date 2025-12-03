/**
 * Recoil Debug Observer
 *
 * Development-only component for debugging Recoil state.
 * Logs state changes and provides snapshot utilities.
 *
 * Usage:
 * Add this component inside RecoilRoot (dev mode only):
 *
 * @example
 * ```tsx
 * <RecoilRoot>
 *   {process.env.NODE_ENV === 'development' && <RecoilDebugObserver />}
 *   <App />
 * </RecoilRoot>
 * ```
 */

import { useEffect } from "react";
import { useRecoilSnapshot, useRecoilTransactionObserver_UNSTABLE } from "recoil";

// ============================================================================
// TYPES
// ============================================================================

export interface DebugConfig {
  /** Enable logging to console */
  enableLogging: boolean;
  /** Filter atom keys to log (regex or string[]) */
  keyFilter?: RegExp | string[];
  /** Log full state snapshots */
  logSnapshots: boolean;
  /** Maximum items to log in arrays */
  maxArrayItems: number;
  /** Collapse large objects in console */
  collapseObjects: boolean;
}

const DEFAULT_CONFIG: DebugConfig = {
  enableLogging: true,
  keyFilter: /^frontdesk\.chatwoot\./,
  logSnapshots: false,
  maxArrayItems: 5,
  collapseObjects: true,
};

// ============================================================================
// GLOBAL DEBUG STATE
// ============================================================================

// Store snapshots for debugging
const snapshotHistory: Array<{
  timestamp: number;
  snapshot: Map<string, unknown>;
}> = [];

const MAX_SNAPSHOT_HISTORY = 50;

// ============================================================================
// DEBUG OBSERVER COMPONENT
// ============================================================================

interface RecoilDebugObserverProps {
  config?: Partial<DebugConfig>;
}

/**
 * Debug observer component
 * Place inside RecoilRoot to observe state changes
 */
export function RecoilDebugObserver({ config = {} }: RecoilDebugObserverProps) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Subscribe to all state changes
  useRecoilTransactionObserver_UNSTABLE(({ snapshot, previousSnapshot }) => {
    if (!mergedConfig.enableLogging) return;

    // Find modified atoms
    const modifiedAtoms: Array<{ key: string; oldValue: unknown; newValue: unknown }> = [];

    for (const node of Array.from(snapshot.getNodes_UNSTABLE({ isModified: true }))) {
      const key = node.key;

      // Apply key filter
      if (mergedConfig.keyFilter) {
        if (mergedConfig.keyFilter instanceof RegExp) {
          if (!mergedConfig.keyFilter.test(key)) continue;
        } else if (Array.isArray(mergedConfig.keyFilter)) {
          if (!mergedConfig.keyFilter.some((k) => key.includes(k))) continue;
        }
      }

      const loadable = snapshot.getLoadable(node);
      const prevLoadable = previousSnapshot.getLoadable(node);

      if (loadable.state === "hasValue" && prevLoadable.state === "hasValue") {
        modifiedAtoms.push({
          key,
          oldValue: prevLoadable.contents,
          newValue: loadable.contents,
        });
      }
    }

    // Log changes
    if (modifiedAtoms.length > 0) {
      console.groupCollapsed(`%c[Recoil] ${modifiedAtoms.length} atom(s) modified`, "color: #9c27b0; font-weight: bold;");

      modifiedAtoms.forEach(({ key, oldValue, newValue }) => {
        const shortKey = key.replace("frontdesk.chatwoot.", "");
        console.groupCollapsed(`%c${shortKey}`, "color: #2196f3;");
        console.log("Previous:", truncateValue(oldValue, mergedConfig));
        console.log("New:", truncateValue(newValue, mergedConfig));
        console.log("Diff:", getDiff(oldValue, newValue));
        console.groupEnd();
      });

      console.groupEnd();
    }
  });

  // Save snapshots for debugging
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    if (!mergedConfig.logSnapshots) return;

    const snapshotMap = new Map<string, unknown>();

    for (const node of Array.from(snapshot.getNodes_UNSTABLE())) {
      const loadable = snapshot.getLoadable(node);
      if (loadable.state === "hasValue") {
        snapshotMap.set(node.key, loadable.contents);
      }
    }

    snapshotHistory.push({
      timestamp: Date.now(),
      snapshot: snapshotMap,
    });

    // Trim history
    while (snapshotHistory.length > MAX_SNAPSHOT_HISTORY) {
      snapshotHistory.shift();
    }
  }, [snapshot, mergedConfig.logSnapshots]);

  return null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Truncate large values for logging
 */
function truncateValue(value: unknown, config: DebugConfig): unknown {
  if (Array.isArray(value)) {
    if (value.length > config.maxArrayItems) {
      return [...value.slice(0, config.maxArrayItems), `... (${value.length - config.maxArrayItems} more)`];
    }
    return value;
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value);
    if (entries.length > 10 && config.collapseObjects) {
      const truncated = Object.fromEntries(entries.slice(0, 10));
      return { ...truncated, "...": `${entries.length - 10} more properties` };
    }
  }

  return value;
}

/**
 * Get a simple diff between two values
 */
function getDiff(oldValue: unknown, newValue: unknown): Record<string, { old: unknown; new: unknown }> | string {
  if (typeof oldValue !== "object" || typeof newValue !== "object") {
    return oldValue === newValue ? "No change" : { value: { old: oldValue, new: newValue } };
  }

  if (oldValue === null || newValue === null) {
    return { value: { old: oldValue, new: newValue } };
  }

  const diff: Record<string, { old: unknown; new: unknown }> = {};
  const allKeys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);

  // Convert Set to Array for iteration compatibility
  Array.from(allKeys).forEach((key) => {
    const oldV = (oldValue as Record<string, unknown>)[key];
    const newV = (newValue as Record<string, unknown>)[key];

    if (JSON.stringify(oldV) !== JSON.stringify(newV)) {
      diff[key] = { old: oldV, new: newV };
    }
  });

  return Object.keys(diff).length > 0 ? diff : "No change";
}

// ============================================================================
// GLOBAL DEBUG UTILITIES
// ============================================================================

/**
 * Debug utilities exposed globally for console debugging
 */
export const recoilDebug = {
  /**
   * Get current snapshot history
   */
  getHistory: () => snapshotHistory,

  /**
   * Get the latest snapshot
   */
  getLatestSnapshot: () => snapshotHistory[snapshotHistory.length - 1],

  /**
   * Compare two snapshots
   */
  compareSnapshots: (index1: number, index2: number) => {
    const snap1 = snapshotHistory[index1];
    const snap2 = snapshotHistory[index2];

    if (!snap1 || !snap2) {
      console.error("Invalid snapshot indices");
      return null;
    }

    const diff: Record<string, { old: unknown; new: unknown }> = {};

    // Convert Map entries to Array for iteration compatibility
    Array.from(snap2.snapshot.entries()).forEach(([key, newValue]) => {
      const oldValue = snap1.snapshot.get(key);
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        diff[key] = { old: oldValue, new: newValue };
      }
    });

    return diff;
  },

  /**
   * Search for a value in snapshots
   */
  findInSnapshots: (searchFn: (key: string, value: unknown) => boolean) => {
    const results: Array<{ snapshotIndex: number; key: string; value: unknown }> = [];

    snapshotHistory.forEach((snap, index) => {
      snap.snapshot.forEach((value, key) => {
        if (searchFn(key, value)) {
          results.push({ snapshotIndex: index, key, value });
        }
      });
    });

    return results;
  },

  /**
   * Clear snapshot history
   */
  clearHistory: () => {
    snapshotHistory.length = 0;
    console.log("[RecoilDebug] Snapshot history cleared");
  },

  /**
   * Log all Chatwoot atoms
   */
  logChatwootState: () => {
    const latest = snapshotHistory[snapshotHistory.length - 1];
    if (!latest) {
      console.log("No snapshots available");
      return;
    }

    console.group("%c[RecoilDebug] Chatwoot State", "color: #9c27b0; font-weight: bold;");

    latest.snapshot.forEach((value, key) => {
      if (key.startsWith("frontdesk.chatwoot.")) {
        const shortKey = key.replace("frontdesk.chatwoot.", "");
        console.log(`%c${shortKey}:`, "color: #2196f3;", value);
      }
    });

    console.groupEnd();
  },
};

// Expose globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).__RECOIL_DEBUG__ = recoilDebug;
}

export default RecoilDebugObserver;
