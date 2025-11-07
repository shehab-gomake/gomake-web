import { useEffect, useRef, useState } from "react";

interface UseWebRTCSenderProps {
  sessionId: string;
  onSignal?: (signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => void;
  onReceiveSignal: (signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => void;
}

export const useWebRTCSender = ({
  sessionId,
  onReceiveSignal,
}: UseWebRTCSenderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

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
    };
  }, []);

  const startScreenShare = async () => {
    try {
      setError(null);
      
      // Get screen share stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
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
    } catch (err: any) {
      console.error("Error handling answer:", err);
      setError(err.message);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.addIceCandidate(candidate);
    } catch (err: any) {
      console.error("Error adding ICE candidate:", err);
      setError(err.message);
    }
  };

  const stopScreenShare = () => {
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
    setError(null);
  };

  return {
    startScreenShare,
    stopScreenShare,
    isSharing,
    isConnected,
    error,
    handleAnswer,
    handleIceCandidate,
  };
};

