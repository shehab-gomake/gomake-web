import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebRTCAudioSenderProps {
  sessionId: string;
  onReceiveSignal: (signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => void;
}

export const useWebRTCAudioSender = ({
  sessionId,
  onReceiveSignal,
}: UseWebRTCAudioSenderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const onReceiveSignalRef = useRef(onReceiveSignal);

  // Update ref when callback changes
  useEffect(() => {
    onReceiveSignalRef.current = onReceiveSignal;
  }, [onReceiveSignal]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null;
      }
    };
  }, []);

  const startAudio = useCallback(async () => {
    try {
      setError(null);
      
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      localStreamRef.current = stream;

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      peerConnectionRef.current = pc;

      // Add tracks to peer connection
      // Use addTransceiver to ensure tracks are properly included in SDP
      stream.getTracks().forEach((track) => {
        const transceiver = pc.addTransceiver(track, {
          direction: 'sendrecv',
        });
        console.log('🎤 Added audio transceiver:', {
          trackId: track.id,
          enabled: track.enabled,
          kind: track.kind,
          transceiverDirection: transceiver.direction,
        });
      });

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && onReceiveSignalRef.current) {
          onReceiveSignalRef.current({
            type: "ice-candidate",
            data: event.candidate,
          });
        }
      };

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log("🎤 Remote audio track received:", {
          trackId: event.track.id,
          trackKind: event.track.kind,
          trackEnabled: event.track.enabled,
          trackReadyState: event.track.readyState,
          streams: event.streams.length,
          transceiver: event.transceiver?.direction,
        });
        
        // Ensure track is enabled
        if (event.track) {
          event.track.enabled = true;
        }
        
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          
          // Ensure audio element is ready to play
          remoteAudioRef.current.play().catch((err) => {
            console.warn("⚠️ Audio play failed (may be expected):", err);
          });
          
          setIsConnected(true);
          setError(null);
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
          stopAudio();
        }
      };

      // Create and send offer
      // Check if local description is already set (prevent duplicate offers)
      if (pc.localDescription) {
        console.log("⚠️ Local description already set, skipping offer creation");
        return;
      }

      // Verify tracks are in the connection before creating offer
      const senders = pc.getSenders();
      console.log("📤 Active senders before creating offer:", senders.length);
      senders.forEach((sender, index) => {
        const track = sender.track;
        console.log(`📤 Sender ${index}:`, {
          trackId: track?.id,
          trackKind: track?.kind,
          trackEnabled: track?.enabled,
          trackReadyState: track?.readyState,
        });
      });

      const offer = await pc.createOffer();
      
      // Log SDP to verify tracks are included
      console.log("📤 Offer SDP:", offer.sdp?.substring(0, 500));
      
      await pc.setLocalDescription(offer);

      console.log("📤 WebRTC Offer created:", {
        type: offer.type,
        sdpLength: offer.sdp?.length,
      });
      console.log("📤 Calling onReceiveSignal with offer");

      if (onReceiveSignalRef.current) {
        onReceiveSignalRef.current({
          type: "offer",
          data: offer,
        });
        console.log("✅ Offer sent via onReceiveSignal");
      } else {
        console.error("❌ onReceiveSignal is null!");
      }
    } catch (err: any) {
      console.error("Error starting audio:", err);
      setError(err.message || "Failed to access microphone");
    }
  }, []);

  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      // Check if remote description is already set
      if (pc.remoteDescription) {
        console.log("⚠️ Remote description already set, skipping duplicate answer");
        return;
      }

      // Check connection state - must be 'have-local-offer' to set remote answer
      if (pc.signalingState !== "have-local-offer") {
        console.warn(`⚠️ Cannot set remote answer in state: ${pc.signalingState}`);
        return;
      }

      await pc.setRemoteDescription(answer);
      
      // Verify receivers after setting remote description
      const receivers = pc.getReceivers();
      console.log("📥 Active receivers after setting answer:", receivers.length);
      receivers.forEach((receiver, index) => {
        const track = receiver.track;
        console.log(`📥 Receiver ${index}:`, {
          trackId: track?.id,
          trackKind: track?.kind,
          trackEnabled: track?.enabled,
          trackReadyState: track?.readyState,
        });
      });
      
      console.log("✅ Remote answer set successfully");
    } catch (err: any) {
      console.error("Error handling answer:", err);
      // Don't set error if it's just a state mismatch (already handled)
      if (!err.message?.includes("wrong state")) {
        setError(err.message);
      }
    }
  }, []);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      // Check if remote description is set (required for ICE candidates)
      if (!pc.remoteDescription) {
        console.log("⚠️ Cannot add ICE candidate: remote description not set yet");
        return;
      }

      await pc.addIceCandidate(candidate);
    } catch (err: any) {
      console.error("Error adding ICE candidate:", err);
      // Don't set error for ICE candidate errors (they're often non-critical)
      if (err.message?.includes("InvalidStateError")) {
        console.warn("⚠️ ICE candidate error (non-critical):", err.message);
      } else {
        setError(err.message);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!audioTracks[0]?.enabled);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    setIsConnected(false);
    setIsMuted(false);
    setError(null);
  }, []);

  return {
    startAudio,
    stopAudio,
    isConnected,
    isMuted,
    error,
    remoteAudioRef,
    handleAnswer,
    handleIceCandidate,
    toggleMute,
  };
};

