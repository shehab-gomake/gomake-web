import { useState, useEffect, useCallback } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import {
  getUnreadTicketCount,
  getUnreadTicketIds,
  getFirstUnreadTicketId,
} from "@/services/api-service/tickets/tickets-api";
import io, { Socket } from "socket.io-client";
import config from "@/config";

export const useTicketNotifications = () => {
  const { callApi } = useGomakeAxios();
  const userProfile = useRecoilValue(userProfileState);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadTicketIds, setUnreadTicketIds] = useState<Set<number>>(new Set());
  const [firstUnreadTicketId, setFirstUnreadTicketId] = useState<number | null>(null);

  const userId = userProfile?.userId || userProfile?.id;

  // Fetch unread count and ticket IDs
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      const [count, ids, firstId] = await Promise.all([
        getUnreadTicketCount(callApi),
        getUnreadTicketIds(callApi),
        getFirstUnreadTicketId(callApi),
      ]);

      setUnreadCount(count);
      setUnreadTicketIds(new Set(ids));
      setFirstUnreadTicketId(firstId);
    } catch (error) {
      console.error("Error fetching ticket notifications:", error);
    }
  }, [callApi, userId]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  // Listen for notification updates via Socket.IO
  useEffect(() => {
    if (!userId) return;

    const socketUrl = config.api_server;
    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("✅ Ticket notifications socket connected:", socket.id);
    });

    const handleNotificationUpdate = (data: { unreadCount: number; ticketId: number }) => {
      console.log("🔔 Ticket notification update received:", data);
      setUnreadCount(data.unreadCount);
      
      // Refresh unread ticket IDs
      fetchNotifications();
    };

    socket.on(`user:${userId}:ticket_notifications_updated`, handleNotificationUpdate);

    return () => {
      socket.off(`user:${userId}:ticket_notifications_updated`, handleNotificationUpdate);
      socket.disconnect();
    };
  }, [userId, fetchNotifications]);

  return {
    unreadCount,
    unreadTicketIds,
    firstUnreadTicketId,
    refreshNotifications: fetchNotifications,
  };
};

