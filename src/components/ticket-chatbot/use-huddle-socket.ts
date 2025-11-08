import { useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import config from "@/config";

// Get Socket.IO server URL from config
const getSocketServerUrl = () => {
  return config.api_server || "http://localhost:3000";
};

// Get auth token from localStorage or wherever it's stored
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    // Try to get token from wherever gomake-web stores it
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  }
  return null;
};

interface HuddleRequest {
  ticketId: number;
  requestedBy: string;
  sessionId: string;
}

interface HuddleResponse {
  ticketId: number;
  sessionId: string;
  accepted: boolean;
  userId?: string;
}

interface WebRTCSignal {
  sessionId: string;
  type: "offer" | "answer" | "ice-candidate";
  data: any;
}

interface HuddleEnded {
  sessionId: string;
  endedBy: string;
  ticketId: number;
}

export const useHuddleSocket = (
  ticketId: number | undefined,
  onHuddleRequest?: (request: HuddleRequest) => void,
  onHuddleResponse?: (response: HuddleResponse) => void,
  onSignal?: (signal: WebRTCSignal) => void,
  onHuddleEnded?: (ended: HuddleEnded) => void
) => {
  const socketRef = useRef<Socket | null>(null);
  const onHuddleRequestRef = useRef(onHuddleRequest);
  const onHuddleResponseRef = useRef(onHuddleResponse);
  const onSignalRef = useRef(onSignal);
  const onHuddleEndedRef = useRef(onHuddleEnded);

  // Update refs when callbacks change
  useEffect(() => {
    onHuddleRequestRef.current = onHuddleRequest;
    onHuddleResponseRef.current = onHuddleResponse;
    onSignalRef.current = onSignal;
    onHuddleEndedRef.current = onHuddleEnded;
  }, [onHuddleRequest, onHuddleResponse, onSignal, onHuddleEnded]);

  useEffect(() => {
    if (!ticketId) {
      return;
    }

    const socketUrl = getSocketServerUrl();
    const authToken = getAuthToken();

    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: authToken ? { token: authToken } : {},
      extraHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });

    socketRef.current = socket;

    // Listen for huddle events
    const requestEventName = `ticket:${ticketId}:huddle_request`;
    const responseEventName = `ticket:${ticketId}:huddle_response`;
    const signalEventName = `ticket:${ticketId}:huddle_signal`;
    const endedEventName = `ticket:${ticketId}:huddle_ended`;

    console.log("🔍 Setting up huddle listeners for:", {
      requestEventName,
      responseEventName,
      signalEventName,
      endedEventName,
      ticketId,
    });

    socket.on("connect", () => {
      console.log("✅ Huddle socket connected:", socket.id, "for ticket:", ticketId);
      console.log("🔍 Listening for event:", requestEventName);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Huddle socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Huddle socket connection error:", error);
    });

    const handleRequest = (data: HuddleRequest) => {
      console.log("📨 Huddle request received:", data);
      console.log("📨 Current callback ref:", !!onHuddleRequestRef.current);
      if (onHuddleRequestRef.current) {
        console.log("✅ Calling onHuddleRequest callback");
        onHuddleRequestRef.current(data);
      } else {
        console.warn("⚠️ onHuddleRequest callback is null!");
      }
    };

    const handleResponse = (data: HuddleResponse) => {
      console.log("📨 Huddle response received:", data);
      if (onHuddleResponseRef.current) {
        onHuddleResponseRef.current(data);
      }
    };

    const handleSignal = (data: WebRTCSignal) => {
      console.log("📨 Huddle WebRTC signal received:", data);
      if (onSignalRef.current) {
        onSignalRef.current(data);
      }
    };

    const handleEnded = (data: HuddleEnded) => {
      console.log("📨 Huddle ended received:", data);
      if (onHuddleEndedRef.current) {
        onHuddleEndedRef.current(data);
      }
    };

    socket.on(requestEventName, handleRequest);
    socket.on(responseEventName, handleResponse);
    socket.on(signalEventName, handleSignal);
    socket.on(endedEventName, handleEnded);

    // Cleanup on unmount or ticket change
    return () => {
      console.log("useHuddleSocket: Cleaning up socket for ticket:", ticketId);
      socket.off(requestEventName, handleRequest);
      socket.off(responseEventName, handleResponse);
      socket.off(signalEventName, handleSignal);
      socket.off(endedEventName, handleEnded);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [ticketId]);

  // Function to emit huddle request
  const emitRequest = (request: HuddleRequest) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(`ticket:${ticketId}:huddle_request`, request);
    }
  };

  // Function to emit huddle response
  const emitResponse = (response: HuddleResponse) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(`ticket:${ticketId}:huddle_response`, response);
    }
  };

  // Function to emit WebRTC signal
  const emitSignal = (signal: WebRTCSignal) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(`ticket:${ticketId}:huddle_signal`, signal);
    }
  };

  return {
    socket: socketRef.current,
    emitRequest,
    emitResponse,
    emitSignal,
  };
};

