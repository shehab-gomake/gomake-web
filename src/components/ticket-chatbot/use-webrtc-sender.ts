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
      const constraints: DisplayMediaStreamConstraints = {
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
          logicalSurface: settings.logicalSurface,
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
      pc.ondatachannel = (event) => {
        console.log("📨 Incoming data channel received:", event.channel.label);
        const channel = event.channel;
        dataChannelRef.current = channel;

        channel.onopen = () => {
          console.log("✅ Data channel opened (sender side)");
          setIsDataChannelReady(true);
        };

        channel.onclose = () => {
          console.log("❌ Data channel closed (sender side)");
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
      if (!pc) return;

      await pc.setRemoteDescription(answer);
      console.log('✅ Remote description (answer) set on sender side');
      
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

