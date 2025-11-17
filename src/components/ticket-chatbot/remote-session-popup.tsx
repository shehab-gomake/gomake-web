import { useEffect, useRef, useState } from 'react';
import { useWebRTCSender, ControlCommand } from './use-webrtc-sender';

interface PopupMessage {
  type: 'START_SESSION' | 'STOP_SESSION' | 'SIGNAL' | 'PING' | 'STATUS_REQUEST';
  sessionId?: string;
  signal?: { type: 'offer' | 'answer' | 'ice-candidate'; data: any };
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

export const RemoteSessionPopup = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [status, setStatus] = useState<{
    isSharing: boolean;
    isConnected: boolean;
    isDataChannelReady: boolean;
    error: string | null;
  }>({
    isSharing: false,
    isConnected: false,
    isDataChannelReady: false,
    error: null,
  });

  const onSignalRef = useRef<((signal: { type: 'offer' | 'answer' | 'ice-candidate'; data: any }) => void) | null>(null);
  const onControlCommandRef = useRef<((command: ControlCommand) => void) | null>(null);

  // Set up WebRTC sender hook
  const sender = useWebRTCSender({
    sessionId: sessionId || '',
    onReceiveSignal: (signal) => {
      // Forward signal to main window
      // Convert RTC objects to plain objects for postMessage (they can't be cloned)
      if (window.opener && !window.opener.closed) {
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
        
        sendMessage({
          type: 'SIGNAL',
          signal: {
            type: signal.type,
            data: serializedData,
          },
        });
      }
    },
    onControlCommand: (command) => {
      console.log('📤 Popup received control command from WebRTC, forwarding to main window:', command.type);
      // Forward control command to main window for execution
      // Commands need to be executed in the main window's context
      if (window.opener && !window.opener.closed) {
        sendMessage({
          type: 'CONTROL_COMMAND',
          command,
        });
      } else {
        console.warn('⚠️ Cannot forward control command - opener window is closed');
      }
    },
  });

  // Update status when sender state changes
  useEffect(() => {
    const newStatus = {
      isSharing: sender.isSharing,
      isConnected: sender.isConnected,
      isDataChannelReady: sender.isDataChannelReady,
      error: sender.error,
    };
    setStatus(newStatus);
    
    // Send status update to main window
    if (window.opener && !window.opener.closed) {
      sendMessage({
        type: 'STATUS_UPDATE',
        status: newStatus,
      });
    }
  }, [sender.isSharing, sender.isConnected, sender.isDataChannelReady, sender.error]);

  // Note: No need to prevent popup closure - popup maintains connection independently
  // Users can navigate freely in the main window without affecting the popup

  // Send PONG when component mounts to indicate popup is ready
  useEffect(() => {
    // Send PONG immediately when popup loads
    if (window.opener && !window.opener.closed) {
      console.log('📤 Sending PONG to parent window...');
      window.opener.postMessage({ type: 'PONG' }, window.location.origin);
    }
  }, []);

  // Listen for messages from the main window
  useEffect(() => {
    const handleMessage = async (event: MessageEvent<PopupMessage>) => {
      // Security: Only accept messages from same origin
      if (event.origin !== window.location.origin) {
        console.warn('⚠️ Ignoring message from different origin:', event.origin);
        return;
      }

      const message = event.data;
      console.log('📨 Popup received message:', message.type);

      switch (message.type) {
        case 'START_SESSION': {
          if (!message.sessionId) {
            console.error('❌ START_SESSION missing sessionId');
            return;
          }

          setSessionId(message.sessionId);
          console.log('✅ Session initialized:', message.sessionId);

          // Start screen sharing
          try {
            await sender.startScreenShare();
          } catch (error: any) {
            console.error('❌ Error starting screen share:', error);
            sendMessage({
              type: 'ERROR',
              error: error.message || 'Failed to start screen share',
            });
          }
          break;
        }

        case 'STOP_SESSION': {
          console.log('🛑 STOP_SESSION received, stopping screen share and closing popup...');
          sender.stopScreenShare();
          setSessionId('');
          // Close the popup window after a short delay to allow cleanup
          setTimeout(() => {
            if (window.opener && !window.opener.closed) {
              // Notify main window that we're closing
              sendMessage({
                type: 'STATUS_UPDATE',
                status: {
                  isSharing: false,
                  isConnected: false,
                  isDataChannelReady: false,
                  error: null,
                },
              });
            }
            window.close();
          }, 500);
          break;
        }

        case 'SIGNAL': {
          if (!message.signal) {
            console.warn('⚠️ SIGNAL received but signal data missing');
            return;
          }

          if (message.signal.type === 'answer') {
            await sender.handleAnswer(message.signal.data);
          } else if (message.signal.type === 'ice-candidate') {
            await sender.handleIceCandidate(message.signal.data);
          }
          break;
        }

        case 'PING': {
          // Respond to ping to confirm popup is alive
          sendMessage({ type: 'PONG' });
          break;
        }

        case 'STATUS_REQUEST': {
          sendMessage({
            type: 'STATUS_UPDATE',
            status: {
              isSharing: status.isSharing,
              isConnected: status.isConnected,
              isDataChannelReady: status.isDataChannelReady,
              error: status.error,
            },
          });
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [sender, status]);

  const sendMessage = (message: StatusMessage) => {
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(message, window.location.origin);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div className={`status ${status.isSharing ? 'active' : status.error ? 'error' : ''}`}>
        {status.error ? (
          <>❌ Error: {status.error}</>
        ) : status.isSharing ? (
          <>
            ✅ Remote session active
            <br />
            {status.isConnected ? '🟢 Connected' : '🟡 Connecting...'}
            <br />
            {status.isDataChannelReady ? '🟢 Control ready' : '🟡 Waiting for control...'}
          </>
        ) : (
          <>Waiting for session to start...</>
        )}
      </div>
    </div>
  );
};

