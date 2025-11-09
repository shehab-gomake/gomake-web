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

interface RemoteSessionRequest {
  ticketId: number;
  requestedBy: string;
  sessionId: string;
}

interface RemoteSessionResponse {
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

interface RemoteSessionEnded {
  sessionId: string;
  endedBy: string;
  ticketId: number;
}

interface DrawingData {
  sessionId: string;
  type: 'draw' | 'erase' | 'clear';
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  color?: string;
  brushSize?: number;
}

export const useRemoteSessionSocket = (
  ticketId: number | undefined,
  onSessionRequest?: (request: RemoteSessionRequest) => void,
  onSessionResponse?: (response: RemoteSessionResponse) => void,
  onSignal?: (signal: WebRTCSignal) => void,
  onSessionEnded?: (ended: RemoteSessionEnded) => void,
  onDrawing?: (drawing: DrawingData) => void
) => {
  const socketRef = useRef<Socket | null>(null);
  const onSessionRequestRef = useRef(onSessionRequest);
  const onSessionResponseRef = useRef(onSessionResponse);
  const onSignalRef = useRef(onSignal);
  const onSessionEndedRef = useRef(onSessionEnded);
  const onDrawingRef = useRef(onDrawing);

  // Update refs when callbacks change
  useEffect(() => {
    onSessionRequestRef.current = onSessionRequest;
    onSessionResponseRef.current = onSessionResponse;
    onSignalRef.current = onSignal;
    onSessionEndedRef.current = onSessionEnded;
    onDrawingRef.current = onDrawing;
  }, [onSessionRequest, onSessionResponse, onSignal, onSessionEnded, onDrawing]);

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

    // Listen for remote session events
    const requestEventName = `ticket:${ticketId}:remote_session_request`;
    const responseEventName = `ticket:${ticketId}:remote_session_response`;
    const signalEventName = `ticket:${ticketId}:remote_session_signal`;
    const endedEventName = `ticket:${ticketId}:remote_session_ended`;
    const drawingEventName = `ticket:${ticketId}:remote_session_drawing`;

    console.log("🔍 Setting up listeners for:", {
      requestEventName,
      responseEventName,
      signalEventName,
      endedEventName,
      drawingEventName,
      ticketId,
    });

    socket.on("connect", () => {
      console.log("✅ Remote session socket connected:", socket.id, "for ticket:", ticketId);
      console.log("🔍 Listening for event:", requestEventName);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Remote session socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Remote session socket connection error:", error);
    });

    const handleRequest = (data: RemoteSessionRequest) => {
      console.log("📨 Remote session request received:", data);
      console.log("📨 Current callback ref:", !!onSessionRequestRef.current);
      if (onSessionRequestRef.current) {
        console.log("✅ Calling onSessionRequest callback");
        onSessionRequestRef.current(data);
      } else {
        console.warn("⚠️ onSessionRequest callback is null!");
      }
    };

    const handleResponse = (data: RemoteSessionResponse) => {
      console.log("📨 Remote session response received:", data);
      if (onSessionResponseRef.current) {
        onSessionResponseRef.current(data);
      }
    };

    const handleSignal = (data: WebRTCSignal) => {
      console.log("📨 WebRTC signal received:", data);
      if (onSignalRef.current) {
        onSignalRef.current(data);
      }
    };

    const handleSessionEnded = (data: RemoteSessionEnded) => {
      console.log("📨 Remote session ended received:", data);
      if (onSessionEndedRef.current) {
        onSessionEndedRef.current(data);
      }
    };

    const handleDrawing = (data: DrawingData) => {
      console.log("📨 Drawing data received:", data);
      if (onDrawingRef.current) {
        onDrawingRef.current(data);
      }
    };

    socket.on(requestEventName, handleRequest);
    socket.on(responseEventName, handleResponse);
    socket.on(signalEventName, handleSignal);
    socket.on(endedEventName, handleSessionEnded);
    socket.on(drawingEventName, handleDrawing);

    // Cleanup on unmount or ticket change
    return () => {
      console.log("useRemoteSessionSocket: Cleaning up socket for ticket:", ticketId);
      socket.off(requestEventName, handleRequest);
      socket.off(responseEventName, handleResponse);
      socket.off(signalEventName, handleSignal);
      socket.off(endedEventName, handleSessionEnded);
      socket.off(drawingEventName, handleDrawing);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [ticketId]);

  // Function to emit remote session request
  const emitRequest = (request: RemoteSessionRequest) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(`ticket:${ticketId}:remote_session_request`, request);
    }
  };

  // Function to emit remote session response
  const emitResponse = (response: RemoteSessionResponse) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(`ticket:${ticketId}:remote_session_response`, response);
    }
  };

  // Function to emit WebRTC signal
  const emitSignal = (signal: WebRTCSignal) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(`ticket:${ticketId}:remote_session_signal`, signal);
    }
  };

  return {
    socket: socketRef.current,
    emitRequest,
    emitResponse,
    emitSignal,
  };
};

