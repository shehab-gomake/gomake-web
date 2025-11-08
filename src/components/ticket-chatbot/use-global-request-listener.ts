import { useEffect, useRef, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import config from "@/config";
import { useRequestNotification } from "./request-notification-context";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getTicketById, getTickets, Ticket } from "@/services/api-service/tickets/tickets-api";
import { RequestNotification } from "./request-notification-context";
import { playNotificationSound } from "./play-notification-sound";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";

// Get Socket.IO server URL from config
const getSocketServerUrl = () => {
  return config.api_server || "http://localhost:3000";
};

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  }
  return null;
};

interface RemoteSessionRequest {
  ticketId: number;
  requestedBy: string;
  sessionId: string;
}

interface HuddleRequest {
  ticketId: number;
  requestedBy: string;
  sessionId: string;
}

/**
 * Global hook that listens for remote session and huddle requests
 * even when the chatbot is closed. This allows showing modal notifications.
 */
export const useGlobalRequestListener = () => {
  const socketRef = useRef<Socket | null>(null);
  const { showRequest } = useRequestNotification();
  const { callApi } = useGomakeAxios();
  const userProfile = useRecoilValue(userProfileState);
  const showRequestRef = useRef(showRequest);
  const [ticketIds, setTicketIds] = useState<number[]>([]);
  const handlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  // Update ref when callback changes
  useEffect(() => {
    showRequestRef.current = showRequest;
  }, [showRequest]);

  // Fetch user's tickets to know which ticket events to listen to
  const fetchTickets = useCallback(async () => {
    try {
      const tickets = await getTickets(callApi);
      const ids = tickets.filter(t => t.id).map(t => t.id!);
      setTicketIds(ids);
    } catch (error) {
      console.error("Error fetching tickets for global listener:", error);
    }
  }, [callApi]);

  // Fetch tickets on mount and periodically
  useEffect(() => {
    if (!userProfile?.userId && !userProfile?.id) return;
    
    fetchTickets();
    // Refresh tickets every 30 seconds to catch new tickets
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, [fetchTickets, userProfile]);

  // Handler for remote session requests
  const handleRemoteSessionRequest = useCallback(async (data: RemoteSessionRequest) => {
    console.log("📨 Global remote session request received:", data);
    
    try {
      // Fetch ticket details
      const ticket = await getTicketById(callApi, data.ticketId);
      
      const notification: RequestNotification = {
        type: "remote_session",
        ticketId: data.ticketId,
        requestedBy: data.requestedBy,
        sessionId: data.sessionId,
        ticket,
      };
      
      showRequestRef.current(notification);
      playNotificationSound();
    } catch (error) {
      console.error("Error fetching ticket for remote session request:", error);
      // Still show the notification even if ticket fetch fails
      const notification: RequestNotification = {
        type: "remote_session",
        ticketId: data.ticketId,
        requestedBy: data.requestedBy,
        sessionId: data.sessionId,
      };
      showRequestRef.current(notification);
      playNotificationSound();
    }
  }, [callApi]);

  // Handler for huddle requests
  const handleHuddleRequest = useCallback(async (data: HuddleRequest) => {
    console.log("📨 Global huddle request received:", data);
    
    try {
      // Fetch ticket details
      const ticket = await getTicketById(callApi, data.ticketId);
      
      const notification: RequestNotification = {
        type: "huddle",
        ticketId: data.ticketId,
        requestedBy: data.requestedBy,
        sessionId: data.sessionId,
        ticket,
      };
      
      showRequestRef.current(notification);
      playNotificationSound();
    } catch (error) {
      console.error("Error fetching ticket for huddle request:", error);
      // Still show the notification even if ticket fetch fails
      const notification: RequestNotification = {
        type: "huddle",
        ticketId: data.ticketId,
        requestedBy: data.requestedBy,
        sessionId: data.sessionId,
      };
      showRequestRef.current(notification);
      playNotificationSound();
    }
  }, [callApi]);

  // Set up socket and listeners for all ticket IDs
  useEffect(() => {
    if (ticketIds.length === 0) return;

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

    socket.on("connect", () => {
      console.log("✅ Global request listener socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Global request listener socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Global request listener socket connection error:", error);
    });

    // Set up listeners for each ticket
    ticketIds.forEach((ticketId) => {
      const remoteSessionEvent = `ticket:${ticketId}:remote_session_request`;
      const huddleEvent = `ticket:${ticketId}:huddle_request`;

      // Create unique handlers for each ticket
      const remoteHandler = (data: RemoteSessionRequest) => handleRemoteSessionRequest(data);
      const huddleHandler = (data: HuddleRequest) => handleHuddleRequest(data);

      // Store handlers for cleanup
      handlersRef.current.set(remoteSessionEvent, remoteHandler);
      handlersRef.current.set(huddleEvent, huddleHandler);

      socket.on(remoteSessionEvent, remoteHandler);
      socket.on(huddleEvent, huddleHandler);
    });

    // Cleanup
    return () => {
      console.log("useGlobalRequestListener: Cleaning up socket");
      ticketIds.forEach((ticketId) => {
        const remoteSessionEvent = `ticket:${ticketId}:remote_session_request`;
        const huddleEvent = `ticket:${ticketId}:huddle_request`;
        
        const remoteHandler = handlersRef.current.get(remoteSessionEvent);
        const huddleHandler = handlersRef.current.get(huddleEvent);
        
        if (remoteHandler) {
          socket.off(remoteSessionEvent, remoteHandler);
        }
        if (huddleHandler) {
          socket.off(huddleEvent, huddleHandler);
        }
      });
      handlersRef.current.clear();
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [ticketIds, handleRemoteSessionRequest, handleHuddleRequest]);

  return {
    socket: socketRef.current,
  };
};

