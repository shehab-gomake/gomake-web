import { useEffect, useRef, useState, useCallback } from "react";

export interface ControlCommand {
  type: 'mouse' | 'keyboard' | 'scroll' | 'focus';
  action: string;
  data: {
    x?: number;
    y?: number;
    button?: number;
    key?: string;
    code?: string;
    deltaX?: number;
    deltaY?: number;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  };
}

interface UseWebRTCSenderProps {
  sessionId: string;
  onSignal?: (signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => void;
  onReceiveSignal: (signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => void;
  onControlCommand?: (command: ControlCommand) => void;
}

export const useWebRTCSender = ({
  sessionId,
  onReceiveSignal,
  onControlCommand,
}: UseWebRTCSenderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDataChannelReady, setIsDataChannelReady] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const onControlCommandRef = useRef(onControlCommand);
  const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  // Update ref when callback changes
  useEffect(() => {
    onControlCommandRef.current = onControlCommand;
  }, [onControlCommand]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, []);

  const startScreenShare = async () => {
    try {
      setError(null);
      
      // Get screen share stream with automatic current tab selection
      // preferCurrentTab: true automatically selects current tab in the picker
      // User can still change selection if needed
      const constraints: MediaStreamConstraints = {
        video: {
          // @ts-ignore - preferCurrentTab is a newer Chrome API (Chrome 104+)
          // Automatically selects current tab when picker opens
          preferCurrentTab: true,
        } as MediaTrackConstraints,
        audio: true,
      };
      
      console.log('📺 Requesting screen share with preferCurrentTab...');
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      // Log what was actually selected
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        console.log('📺 Screen share selected:', {
          displaySurface: settings.displaySurface,
          // @ts-ignore - logicalSurface is an experimental property not in TypeScript definitions
          logicalSurface: (settings as any).logicalSurface,
        });
        
        // Show user-friendly message about what's being shared
        if (settings.displaySurface === 'browser') {
          console.log('✅ Current Chrome tab is being shared');
        } else {
          console.log('⚠️ User selected:', settings.displaySurface);
        }
      }

      localStreamRef.current = stream;

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      peerConnectionRef.current = pc;

      // Listen for incoming data channel (created by receiver)
      // This event fires when the remote peer creates a data channel
      console.log("📊 Setting up ondatachannel listener...");
      pc.ondatachannel = (event) => {
        console.log("📨 Incoming data channel received!");
        console.log("  - Channel label:", event.channel.label);
        console.log("  - Channel id:", event.channel.id);
        console.log("  - Channel readyState:", event.channel.readyState);
        console.log("  - Channel ordered:", event.channel.ordered);
        console.log("  - Channel protocol:", event.channel.protocol);
        
        const channel = event.channel;
        dataChannelRef.current = channel;

        channel.onopen = () => {
          console.log("✅ Data channel opened (sender side)");
          console.log("  - Channel readyState:", channel.readyState);
          setIsDataChannelReady(true);
        };

        channel.onclose = () => {
          console.log("❌ Data channel closed (sender side)");
          console.log("  - Channel readyState:", channel.readyState);
          setIsDataChannelReady(false);
        };

        channel.onerror = (error) => {
          console.error("❌ Data channel error (sender side):", error);
          setError("Data channel error");
          setIsDataChannelReady(false);
        };

        channel.onmessage = (event) => {
          try {
            const command: ControlCommand = JSON.parse(event.data);
            console.log("📨 Control command received:", command);
            if (onControlCommandRef.current) {
              onControlCommandRef.current(command);
            }
          } catch (err) {
            console.error("❌ Error parsing control command:", err);
          }
        };
      };
      
      // Also check if data channel arrives after answer is set
      // Sometimes the event fires after setRemoteDescription
      console.log("📊 Peer connection state when setting up data channel listener:");
      console.log("  - Signaling state:", pc.signalingState);
      console.log("  - Connection state:", pc.connectionState);

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          onReceiveSignal({
            type: "ice-candidate",
            data: event.candidate,
          });
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log("🔗 Connection state:", pc.connectionState);
        if (pc.connectionState === "connected") {
          setIsConnected(true);
          setError(null);
        } else if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          setIsConnected(false);
          setError("Connection failed");
          stopScreenShare();
        }
      };

      // Handle stream ended (user stops sharing)
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("📤 WebRTC Offer created:", offer);
      console.log("📤 Calling onReceiveSignal with offer");

      if (onReceiveSignal) {
        onReceiveSignal({
          type: "offer",
          data: offer,
        });
        console.log("✅ Offer sent via onReceiveSignal");
      } else {
        console.error("❌ onReceiveSignal is null!");
      }

      setIsSharing(true);
    } catch (err: any) {
      console.error("Error starting screen share:", err);
      setError(err.message || "Failed to start screen share");
      setIsSharing(false);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) {
        console.error('❌ Peer connection is null in handleAnswer');
        return;
      }

      console.log('📥 Handling answer on sender side...');
      console.log('📊 Peer connection state before setRemoteDescription:');
      console.log('  - Signaling state:', pc.signalingState);
      console.log('  - Connection state:', pc.connectionState);
      console.log('  - Data channel exists:', !!dataChannelRef.current);
      console.log('  - Data channel state:', dataChannelRef.current?.readyState);
      
      // Check if answer SDP includes data channel
      const sdpIncludesDataChannel = answer.sdp?.includes('m=application') || 
                                      answer.sdp?.includes('data') ||
                                      answer.sdp?.includes('webrtc-datachannel');
      console.log('📊 Answer SDP includes data channel:', sdpIncludesDataChannel);
      if (sdpIncludesDataChannel) {
        console.log('✅ Answer SDP includes data channel - ondatachannel should fire after setRemoteDescription');
      } else {
        console.warn('⚠️ Answer SDP does NOT include data channel!');
        console.warn('⚠️ This means the data channel will not be established!');
        console.warn('📊 Answer SDP preview:', answer.sdp?.substring(0, 500));
      }

      await pc.setRemoteDescription(answer);
      console.log('✅ Remote description (answer) set on sender side');
      console.log('📊 Peer connection state after setRemoteDescription:');
      console.log('  - Signaling state:', pc.signalingState);
      console.log('  - Connection state:', pc.connectionState);
      console.log('  - Data channel exists:', !!dataChannelRef.current);
      console.log('  - Data channel state:', dataChannelRef.current?.readyState);
      
      // The ondatachannel event should fire after setRemoteDescription if data channel is in SDP
      // Wait a moment and check if data channel was received
      setTimeout(() => {
        if (dataChannelRef.current) {
          console.log('✅ Data channel received after setRemoteDescription');
          console.log('  - Channel readyState:', dataChannelRef.current.readyState);
        } else {
          console.warn('⚠️ Data channel not received after setRemoteDescription');
          console.warn('⚠️ This might mean the data channel is not in the answer SDP');
        }
      }, 100);
      
      // Process any pending ICE candidates that arrived before remote description was set
      if (pendingIceCandidatesRef.current.length > 0) {
        console.log(`📥 Processing ${pendingIceCandidatesRef.current.length} pending ICE candidates...`);
        for (const candidate of pendingIceCandidatesRef.current) {
          try {
            await pc.addIceCandidate(candidate);
            console.log('✅ Pending ICE candidate added');
          } catch (err: any) {
            console.warn('⚠️ Error adding pending ICE candidate:', err);
          }
        }
        pendingIceCandidatesRef.current = [];
      }
    } catch (err: any) {
      console.error("Error handling answer:", err);
      setError(err.message);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      // Check if remote description is set (required for ICE candidates)
      if (!pc.remoteDescription) {
        console.log('⚠️ Cannot add ICE candidate: remote description not set yet, queuing...');
        // Queue the candidate to be added after remote description is set
        pendingIceCandidatesRef.current.push(candidate);
        return;
      }

      await pc.addIceCandidate(candidate);
      console.log('✅ ICE candidate added successfully');
    } catch (err: any) {
      console.error("Error adding ICE candidate:", err);
      // Don't set error for ICE candidate errors (they're often non-critical)
      if (err.message?.includes('InvalidStateError')) {
        console.warn('⚠️ ICE candidate error (non-critical):', err.message);
      } else {
        setError(err.message);
      }
    }
  };

  const stopScreenShare = () => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setIsSharing(false);
    setIsConnected(false);
    setIsDataChannelReady(false);
    setError(null);
  };

  return {
    startScreenShare,
    stopScreenShare,
    isSharing,
    isConnected,
    isDataChannelReady,
    error,
    handleAnswer,
    handleIceCandidate,
  };
};

