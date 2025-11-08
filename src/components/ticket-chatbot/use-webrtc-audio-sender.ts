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
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
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
        console.log("🎤 Remote audio track received:", event);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
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
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("📤 WebRTC Offer created:", offer);
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

      await pc.setRemoteDescription(answer);
    } catch (err: any) {
      console.error("Error handling answer:", err);
      setError(err.message);
    }
  }, []);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.addIceCandidate(candidate);
    } catch (err: any) {
      console.error("Error adding ICE candidate:", err);
      setError(err.message);
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

