import { useEffect, useRef, useState, useCallback } from 'react';
import { ControlCommand } from './use-webrtc-sender';
import { useGlobalPopupMessageListener } from './use-global-popup-message-listener';

interface PopupMessage {
  type: 'START_SESSION' | 'STOP_SESSION' | 'SIGNAL' | 'PING' | 'STATUS_REQUEST';
  sessionId?: string;
  signal?: { type: 'offer' | 'answer' | 'ice-candidate'; data: any };
  onSignal?: (signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => void;
  onControlCommand?: (command: ControlCommand) => void;
}

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

interface UseRemoteSessionPopupReturn {
  isPopupOpen: boolean;
  isSharing: boolean;
  isConnected: boolean;
  isDataChannelReady: boolean;
  error: string | null;
  startSession: (sessionId: string, onSignal: (signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => void, onControlCommand: (command: ControlCommand) => void) => Promise<void>;
  stopSession: () => void;
  sendSignal: (signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => void;
}

const POPUP_URL = '/remote-session-popup';
const POPUP_WIDTH = 800;
const POPUP_HEIGHT = 600;

// No need to inject React app - Next.js page will handle it

export const useRemoteSessionPopup = (): UseRemoteSessionPopupReturn => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDataChannelReady, setIsDataChannelReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const popupRef = useRef<Window | null>(null);
  const onSignalRef = useRef<((signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => void) | null>(null);
  const onControlCommandRef = useRef<((command: ControlCommand) => void) | null>(null);
  
  // Use global message listener to persist across navigation
  const { setOnControlCommand, setOnSignal, setOnStatusUpdate } = useGlobalPopupMessageListener();

  // Reconnect to existing popup on mount (after page navigation)
  // Note: We don't automatically reconnect here to avoid opening blank windows
  // Reconnection will happen in startSession if needed
  useEffect(() => {
    // Just check if we have a stored popup info, but don't try to reconnect yet
    // Reconnection will happen when startSession is called
    try {
      const storedPopupInfo = sessionStorage.getItem('remoteSessionPopup');
      if (storedPopupInfo) {
        console.log('ℹ️ Found stored popup info, will reconnect when session starts');
      }
    } catch (error) {
      console.error('❌ Error checking stored popup info:', error);
    }
  }, []); // Only run on mount

  // Register callbacks with global listener (persists across navigation)
  // Update registration whenever refs change to ensure latest handlers are used
  useEffect(() => {
    // Register control command handler - always reads from current ref
    setOnControlCommand((command) => {
      console.log('📨 Global listener forwarding CONTROL_COMMAND:', command.type, { hasRef: !!onControlCommandRef.current });
      if (onControlCommandRef.current) {
        onControlCommandRef.current(command);
      } else {
        console.warn('⚠️ Global listener received CONTROL_COMMAND but ref is null');
      }
    });
    
    // Register signal handler - always reads from current ref
    setOnSignal((signal) => {
      if (onSignalRef.current) {
        onSignalRef.current(signal);
      }
    });
    
    // Register status update handler
    setOnStatusUpdate((status) => {
      if (status) {
        setIsSharing(status.isSharing);
        setIsConnected(status.isConnected);
        setIsDataChannelReady(status.isDataChannelReady);
        setError(status.error);
      }
    });
    
    return () => {
      // Don't clear callbacks on unmount - they need to persist across navigation
      // The global listener will continue to work even if this component unmounts
    };
  }, [setOnControlCommand, setOnSignal, setOnStatusUpdate]);
  
  // Update global listener when refs change
  useEffect(() => {
    // The wrapper functions above already read from refs, so they'll always use latest values
    // This effect just ensures registration happens when refs are initialized
  }, [onControlCommandRef.current, onSignalRef.current]);

  // Monitor popup closure (no auto-reopen)
  useEffect(() => {
    if (isPopupOpen && popupRef.current) {
      const checkClosed = setInterval(() => {
        if (popupRef.current && popupRef.current.closed) {
          console.log('⚠️ Popup was closed by user');
          setIsPopupOpen(false);
          setIsSharing(false);
          setIsConnected(false);
          setIsDataChannelReady(false);
          clearInterval(checkClosed);
        }
      }, 1000); // Check every second

      return () => {
        clearInterval(checkClosed);
      };
    }
  }, [isPopupOpen]);

  const openPopup = useCallback((): Window | null => {
    try {
      console.log('🪟 Attempting to open popup window...');
      console.log('📋 Popup URL:', POPUP_URL);
      
      // Calculate popup position (center of screen)
      const left = Math.max(0, (window.screen.width - POPUP_WIDTH) / 2);
      const top = Math.max(0, (window.screen.height - POPUP_HEIGHT) / 2);

      const popupFeatures = `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${Math.round(left)},top=${Math.round(top)},resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,location=no`;
      console.log('📋 Popup features:', popupFeatures);

      const popup = window.open(
        POPUP_URL,
        'remoteSessionPopup',
        popupFeatures
      );

      if (!popup) {
        const errorMsg = 'Popup was blocked. Please allow popups for this site.';
        console.error('❌', errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('✅ Popup window opened successfully');
      console.log('📊 Popup window:', popup);

      // Store popup info
      const popupInfo = {
        windowName: 'remoteSessionPopup',
        timestamp: Date.now(),
      };
      sessionStorage.setItem('remoteSessionPopup', JSON.stringify(popupInfo));
      console.log('💾 Stored popup info in sessionStorage');

      return popup;
    } catch (error: any) {
      console.error('❌ Error opening popup:', error);
      setError(error.message || 'Failed to open popup window');
      return null;
    }
  }, []);

  const sendMessageToPopup = useCallback((message: PopupMessage) => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.postMessage(message, window.location.origin);
    } else {
      console.warn('⚠️ Cannot send message: popup is closed');
    }
  }, []);

  const startSession = useCallback(async (
    sessionId: string,
    onSignal: (signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => void,
    onControlCommand: (command: ControlCommand) => void
  ) => {
    try {
      setError(null);
      onSignalRef.current = onSignal;
      onControlCommandRef.current = onControlCommand;

      // Store session ID
      sessionStorage.setItem('remoteSessionSessionId', sessionId);

      // Open or reuse popup
      if (!popupRef.current || popupRef.current.closed) {
        // Always open a new popup when starting a session
        // The popup will persist across page navigations on its own
        console.log('🪟 Opening new popup window...');
        const popup = openPopup();
        if (!popup) {
          const errorMsg = 'Failed to open popup window. Popup may be blocked.';
          console.error('❌', errorMsg);
          throw new Error(errorMsg);
        }
        popupRef.current = popup;
        setIsPopupOpen(true);
        console.log('✅ Popup reference stored, waiting for popup to be ready...');

        // Wait for popup to be ready
        await new Promise<void>((resolve, reject) => {
          let pingCount = 0;
          const maxPings = 20; // 10 seconds max (20 * 500ms)
          
          const timeout = setTimeout(() => {
            clearInterval(checkReady);
            const errorMsg = 'Popup did not respond in time. It may not have loaded correctly.';
            console.error('❌', errorMsg);
            reject(new Error(errorMsg));
          }, 10000);

          const checkReady = setInterval(() => {
            pingCount++;
            if (popupRef.current && !popupRef.current.closed) {
              console.log(`📡 Pinging popup (attempt ${pingCount}/${maxPings})...`);
              sendMessageToPopup({ type: 'PING' });
              
              // Wait for PONG response
              const messageHandler = (event: MessageEvent<StatusMessage | { type: 'PONG' }>) => {
                if (event.origin !== window.location.origin) {
                  return; // Ignore messages from different origins
                }
                
                if (event.data.type === 'PONG') {
                  console.log('✅ Popup responded with PONG, popup is ready!');
                  clearTimeout(timeout);
                  clearInterval(checkReady);
                  window.removeEventListener('message', messageHandler);
                  resolve();
                }
              };
              
              // Only add listener once
              if (pingCount === 1) {
                window.addEventListener('message', messageHandler);
              }
            } else {
              console.warn('⚠️ Popup is closed, stopping ping attempts');
              clearTimeout(timeout);
              clearInterval(checkReady);
              reject(new Error('Popup was closed before it could respond'));
            }
          }, 500);
        });
        
        console.log('✅ Popup is ready, starting session...');
      } else {
        console.log('✅ Reusing existing popup reference');
      }

      // Store callbacks in refs (can't send functions via postMessage)
      onSignalRef.current = onSignal;
      onControlCommandRef.current = onControlCommand;

      // Start session in popup (don't send callbacks - they're stored in refs)
      sendMessageToPopup({
        type: 'START_SESSION',
        sessionId,
      });

    } catch (error: any) {
      console.error('❌ Error starting session:', error);
      setError(error.message || 'Failed to start session');
      throw error;
    }
  }, [openPopup, sendMessageToPopup]);

  const stopSession = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      sendMessageToPopup({ type: 'STOP_SESSION' });
    }

    // Close popup
    if (popupRef.current) {
      popupRef.current.close();
      popupRef.current = null;
    }

    // Clear storage
    sessionStorage.removeItem('remoteSessionPopup');
    sessionStorage.removeItem('remoteSessionSessionId');

    setIsPopupOpen(false);
    setIsSharing(false);
    setIsConnected(false);
    setIsDataChannelReady(false);
    setError(null);
  }, [sendMessageToPopup]);

  const sendSignal = useCallback((signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => {
    // Serialize RTC objects to plain objects for postMessage (they can't be cloned)
    let serializedData: any;
    
    if (signal.type === 'ice-candidate') {
      // Convert RTCIceCandidate to plain object
      if (signal.data instanceof RTCIceCandidate) {
        serializedData = {
          candidate: signal.data.candidate,
          sdpMLineIndex: signal.data.sdpMLineIndex,
          sdpMid: signal.data.sdpMid,
        };
      } else {
        // Already a plain object
        serializedData = signal.data;
      }
    } else if (signal.type === 'offer' || signal.type === 'answer') {
      // Convert RTCSessionDescriptionInit to plain object
      if (signal.data instanceof RTCSessionDescription) {
        serializedData = {
          type: signal.data.type,
          sdp: signal.data.sdp,
        };
      } else {
        // Already a plain object
        serializedData = signal.data;
      }
    } else {
      serializedData = signal.data;
    }
    
    sendMessageToPopup({
      type: 'SIGNAL',
      signal: {
        type: signal.type,
        data: serializedData,
      },
    });
  }, [sendMessageToPopup]);

  // Don't close popup on unmount - it should persist across page navigations
  // The popup will only be closed when explicitly stopped via stopSession()

  return {
    isPopupOpen,
    isSharing,
    isConnected,
    isDataChannelReady,
    error,
    startSession,
    stopSession,
    sendSignal,
  };
};

