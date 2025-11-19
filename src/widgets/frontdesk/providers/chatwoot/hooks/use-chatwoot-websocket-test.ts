/**
 * Chatwoot WebSocket Test Hook
 *
 * Manages WebSocket connection testing for Chatwoot provider.
 * Handles connection lifecycle, event listening, and state management.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  chatwootWebSocketStateAtom,
  chatwootWebSocketEventsAtom,
  chatwootWebSocketErrorAtom,
  chatwootWebSocketStatsAtom,
  ChatwootWebSocketState,
  chatwootProfileAtom,
  chatwootSelectedAccountAtom,
} from '@/store/frontdesk/atoms/chatwoot.atoms';
import {
  chatwootWebSocketService,
  ConnectionState,
  ChatwootWebSocketEventData,
} from '@/services/frontdesk/websocket/chatwoot-websocket.service';

/**
 * Hook for testing Chatwoot WebSocket connections
 */
export const useChatwootWebSocketTest = () => {
  // Recoil state
  const [connectionState, setConnectionState] = useRecoilState(chatwootWebSocketStateAtom);
  const [events, setEvents] = useRecoilState(chatwootWebSocketEventsAtom);
  const [error, setError] = useRecoilState(chatwootWebSocketErrorAtom);
  const [stats, setStats] = useRecoilState(chatwootWebSocketStatsAtom);

  // Profile and account data
  const profile = useRecoilValue(chatwootProfileAtom);
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);

  // Refs for handlers to avoid stale closures
  const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Map service connection state to atom state
   */
  const mapConnectionState = useCallback((state: ConnectionState): ChatwootWebSocketState => {
    switch (state) {
      case ConnectionState.DISCONNECTED:
        return ChatwootWebSocketState.DISCONNECTED;
      case ConnectionState.CONNECTING:
        return ChatwootWebSocketState.CONNECTING;
      case ConnectionState.CONNECTED:
        return ChatwootWebSocketState.CONNECTED;
      case ConnectionState.ERROR:
        return ChatwootWebSocketState.ERROR;
      default:
        return ChatwootWebSocketState.DISCONNECTED;
    }
  }, []);

  /**
   * Update stats from service
   */
  const updateStats = useCallback(() => {
    const serviceStats = chatwootWebSocketService.getStats();
    const uptime = chatwootWebSocketService.getUptime();

    setStats({
      eventsReceived: serviceStats.eventsReceived,
      uptime,
      reconnectionAttempts: serviceStats.reconnectionAttempts,
      lastEventAt: serviceStats.lastEventAt,
    });
  }, [setStats]);

  /**
   * Start stats update interval
   */
  const startStatsInterval = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
    }

    statsIntervalRef.current = setInterval(() => {
      updateStats();
    }, 1000); // Update every second
  }, [updateStats]);

  /**
   * Stop stats update interval
   */
  const stopStatsInterval = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  }, []);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(async () => {
    try {
      // Validate profile and account
      if (!profile) {
        const errorMsg = 'Profile not loaded. Please wait for profile to load.';
        setError(errorMsg);
        setConnectionState(ChatwootWebSocketState.ERROR);
        return;
      }

      if (!selectedAccountId) {
        const errorMsg = 'No account selected. Please select an account first.';
        setError(errorMsg);
        setConnectionState(ChatwootWebSocketState.ERROR);
        return;
      }

      if (!profile.pubsub_token) {
        const errorMsg = 'Missing pubsub_token in profile. Cannot connect to WebSocket.';
        setError(errorMsg);
        setConnectionState(ChatwootWebSocketState.ERROR);
        return;
      }

      setError(null);
      setConnectionState(ChatwootWebSocketState.CONNECTING);

      // Connect with account and user info
      await chatwootWebSocketService.connect({
        accountId: selectedAccountId,
        userId: profile.id,
        pubsubToken: profile.pubsub_token,
      });

      setConnectionState(ChatwootWebSocketState.CONNECTED);
      startStatsInterval();

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMsg);
      setConnectionState(ChatwootWebSocketState.ERROR);
    }
  }, [profile, selectedAccountId, setError, setConnectionState, startStatsInterval]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    chatwootWebSocketService.disconnect();
    setConnectionState(ChatwootWebSocketState.DISCONNECTED);
    stopStatsInterval();
    setError(null);
  }, [setConnectionState, setError, stopStatsInterval]);

  /**
   * Reconnect to WebSocket
   */
  const reconnect = useCallback(async () => {
    try {
      setError(null);
      setConnectionState(ChatwootWebSocketState.CONNECTING);

      await chatwootWebSocketService.reconnect();

      setConnectionState(ChatwootWebSocketState.CONNECTED);
      startStatsInterval();

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reconnect';
      setError(errorMsg);
      setConnectionState(ChatwootWebSocketState.ERROR);
    }
  }, [setError, setConnectionState, startStatsInterval]);

  /**
   * Clear event log
   */
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, [setEvents]);

  /**
   * Reset statistics
   */
  const resetStats = useCallback(() => {
    chatwootWebSocketService.resetStats();
    updateStats();
  }, [updateStats]);

  /**
   * Export events as JSON
   */
  const exportEventsAsJSON = useCallback(() => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatwoot-websocket-events-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [events]);

  /**
   * Export events as CSV
   */
  const exportEventsAsCSV = useCallback(() => {
    const header = 'Timestamp,Event Type,Data\n';
    const rows = events.map(event => {
      const timestamp = new Date(event.timestamp).toISOString();
      const eventType = event.event;
      const data = JSON.stringify(event.data).replace(/"/g, '""'); // Escape quotes
      return `"${timestamp}","${eventType}","${data}"`;
    }).join('\n');

    const csv = header + rows;
    const dataBlob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatwoot-websocket-events-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [events]);

  /**
   * Get connection config
   */
  const getConnectionConfig = useCallback(() => {
    return chatwootWebSocketService.getCurrentConfig();
  }, []);

  /**
   * Toggle debug mode
   */
  const toggleDebug = useCallback((enabled: boolean) => {
    chatwootWebSocketService.setDebug(enabled);
  }, []);

  /**
   * Set up event handlers on mount
   */
  useEffect(() => {
    // Handler for all events
    const handleEvent = (eventData: ChatwootWebSocketEventData) => {
      setEvents(prev => {
        const newEvent = {
          id: `${eventData.timestamp}-${Math.random().toString(36).substr(2, 9)}`,
          event: eventData.event,
          data: eventData.data,
          timestamp: eventData.timestamp,
        };

        // Keep only last 500 events to prevent memory issues
        const updatedEvents = [newEvent, ...prev].slice(0, 500);
        return updatedEvents;
      });

      // Update stats immediately when event received
      updateStats();
    };

    // Handler for connection state changes
    const handleStateChange = (state: ConnectionState) => {
      setConnectionState(mapConnectionState(state));

      if (state === ConnectionState.CONNECTED) {
        startStatsInterval();
      } else if (state === ConnectionState.DISCONNECTED || state === ConnectionState.ERROR) {
        stopStatsInterval();
      }
    };

    // Handler for errors
    const handleError = (errorMsg: string) => {
      setError(errorMsg);
    };

    // Register handlers
    chatwootWebSocketService.on('*', handleEvent); // Listen to all events
    chatwootWebSocketService.onStateChange(handleStateChange);
    chatwootWebSocketService.onError(handleError);

    // Sync initial state
    const currentState = chatwootWebSocketService.getConnectionState();
    setConnectionState(mapConnectionState(currentState));

    // Cleanup on unmount
    return () => {
      chatwootWebSocketService.off('*', handleEvent);
      chatwootWebSocketService.offStateChange(handleStateChange);
      chatwootWebSocketService.offError(handleError);
      stopStatsInterval();
    };
  }, [setEvents, setConnectionState, setError, mapConnectionState, updateStats, startStatsInterval, stopStatsInterval]);

  return {
    // State
    connectionState,
    events,
    error,
    stats,
    profile,
    selectedAccountId,

    // Actions
    connect,
    disconnect,
    reconnect,
    clearEvents,
    resetStats,
    exportEventsAsJSON,
    exportEventsAsCSV,
    getConnectionConfig,
    toggleDebug,

    // Helpers
    isConnected: connectionState === ChatwootWebSocketState.CONNECTED,
    isConnecting: connectionState === ChatwootWebSocketState.CONNECTING,
    isDisconnected: connectionState === ChatwootWebSocketState.DISCONNECTED,
    hasError: connectionState === ChatwootWebSocketState.ERROR,
  };
};
