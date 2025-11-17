import { useEffect, useRef } from 'react';
import { ControlCommand } from './use-webrtc-sender';

interface StatusMessage {
  type: 'STATUS_UPDATE' | 'CONTROL_COMMAND' | 'ERROR' | 'PONG' | 'SIGNAL';
  status?: {
    isSharing: boolean;
    isConnected: boolean;
    isDataChannelReady: boolean;
    error: string | null;
  };
  command?: ControlCommand;
  error?: string;
  signal?: { type: 'offer' | 'answer' | 'ice-candidate'; data: any };
}

// Global refs to store callbacks - these persist across navigation
const globalOnControlCommandRef = { current: null as ((command: ControlCommand) => void) | null };
const globalOnSignalRef = { current: null as ((signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => void) | null };
const globalStatusUpdateRef = { current: null as ((status: StatusMessage['status']) => void) | null };

/**
 * Global hook that listens for messages from the remote session popup
 * This persists across page navigation, allowing control commands to work
 * even when the user navigates to different pages.
 */
export const useGlobalPopupMessageListener = () => {
  // Set up global message listener once (persists across navigation)
  useEffect(() => {
    const handleMessage = (event: MessageEvent<StatusMessage>) => {
      // Security: Only accept messages from same origin
      if (event.origin !== window.location.origin) {
        return;
      }

      const message = event.data;
      console.log('📨 Global listener received message from popup:', message.type);

      switch (message.type) {
        case 'STATUS_UPDATE': {
          if (message.status && globalStatusUpdateRef.current) {
            globalStatusUpdateRef.current(message.status);
          }
          break;
        }

        case 'CONTROL_COMMAND': {
          console.log('📨 Global listener received CONTROL_COMMAND:', message.command?.type, { hasCallback: !!globalOnControlCommandRef.current });
          if (message.command && globalOnControlCommandRef.current) {
            globalOnControlCommandRef.current(message.command);
          } else {
            console.warn('⚠️ CONTROL_COMMAND received but no callback:', { hasCommand: !!message.command, hasCallback: !!globalOnControlCommandRef.current });
          }
          break;
        }

        case 'SIGNAL': {
          if (message.signal && globalOnSignalRef.current) {
            globalOnSignalRef.current(message.signal);
          }
          break;
        }

        case 'ERROR': {
          console.error('❌ Popup error:', message.error);
          break;
        }

        case 'PONG': {
          // Popup is alive
          break;
        }
      }
    };

    // Add listener to window (not component-specific)
    window.addEventListener('message', handleMessage);
    console.log('✅ Global popup message listener set up');

    // Note: We don't remove this listener on unmount because it needs to persist across navigation
    // The listener will persist for the lifetime of the application
    return () => {
      // Only remove if we're sure we want to (e.g., on app unmount)
      // For now, we keep it persistent
      console.log('⚠️ Global popup message listener cleanup (should not happen during navigation)');
    };
  }, []); // Only run once on mount

  return {
    setOnControlCommand: (callback: ((command: ControlCommand) => void) | null) => {
      globalOnControlCommandRef.current = callback;
      console.log('🔄 Updated global control command callback', { hasCallback: !!callback });
    },
    setOnSignal: (callback: ((signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => void) | null) => {
      globalOnSignalRef.current = callback;
      console.log('🔄 Updated global signal callback', { hasCallback: !!callback });
    },
    setOnStatusUpdate: (callback: ((status: StatusMessage['status']) => void) | null) => {
      globalStatusUpdateRef.current = callback;
      console.log('🔄 Updated global status update callback', { hasCallback: !!callback });
    },
  };
};

