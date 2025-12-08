import { useState, useEffect, useCallback, useRef } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import {
  getUnreadTicketIds,
  getTicketById,
  getTicketMessages,
  Ticket,
  TicketMessage,
} from "@/services/api-service/tickets/tickets-api";
import io, { Socket } from "socket.io-client";
import config from "@/config";

interface SupportReplyCardData {
  ticket: Ticket;
  lastSupportMessage: TicketMessage;
}

const STORAGE_KEY = "supportDismissedIds";

// Get dismissed ticket IDs from localStorage
const getDismissedIds = (): number[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save dismissed ticket IDs to localStorage
const saveDismissedIds = (ids: number[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error("Error saving dismissed IDs:", error);
  }
};

export const useSupportReplyCards = () => {
  const { callApi } = useGomakeAxios();
  const userProfile = useRecoilValue(userProfileState);
  const [cards, setCards] = useState<SupportReplyCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<number[]>(getDismissedIds());
  const dismissedIdsRef = useRef<number[]>(getDismissedIds());

  const userId = userProfile?.userId || userProfile?.id;

  // Keep ref in sync with state
  useEffect(() => {
    dismissedIdsRef.current = dismissedIds;
  }, [dismissedIds]);

  // Load dismissed IDs from localStorage on mount
  useEffect(() => {
    const initialDismissedIds = getDismissedIds();
    setDismissedIds(initialDismissedIds);
    dismissedIdsRef.current = initialDismissedIds;
  }, []);

  // Fetch ticket data and messages for unread tickets
  const fetchSupportReplyCards = useCallback(async () => {
    if (!userId) {
      setCards([]);
      return;
    }

    setIsLoading(true);
    try {
      // Get unread ticket IDs
      const unreadIds = await getUnreadTicketIds(callApi);

      // Get current dismissed IDs from ref (always latest)
      let currentDismissedIds = dismissedIdsRef.current;

      // If a dismissed ticket appears in unreadIds, it means there's a new message
      // Remove it from dismissedIds so the card shows again
      const newlyUnreadDismissedIds = unreadIds.filter((id) =>
        currentDismissedIds.includes(id)
      );
      if (newlyUnreadDismissedIds.length > 0) {
        currentDismissedIds = currentDismissedIds.filter(
          (id) => !newlyUnreadDismissedIds.includes(id)
        );
        setDismissedIds(currentDismissedIds);
        dismissedIdsRef.current = currentDismissedIds;
        saveDismissedIds(currentDismissedIds);
      }

      // Filter out dismissed tickets
      const activeUnreadIds = unreadIds.filter(
        (id) => !currentDismissedIds.includes(id)
      );

      if (activeUnreadIds.length === 0) {
        setCards([]);
        setIsLoading(false);
        return;
      }

      // Fetch ticket details and messages for each unread ticket
      const cardPromises = activeUnreadIds.map(async (ticketId) => {
        try {
          const [ticket, messages] = await Promise.all([
            getTicketById(callApi, ticketId),
            getTicketMessages(callApi, ticketId),
          ]);

          // Filter to only support messages (exclude AI messages)
          const supportMessages = messages.filter(
            (msg) =>
              msg.senderType === "support" &&
              msg.senderId !== "ai-support-system" &&
              msg.senderName !== "AI Support Assistant"
          );

          // Get the last support message (from actual employee, not AI)
          if (supportMessages.length > 0) {
            const lastSupportMessage =
              supportMessages[supportMessages.length - 1];

            // Only include if last message in ticket is from support employee (not AI)
            // (check if last message overall is from support employee)
            const lastMessageOverall = messages[messages.length - 1];
            if (
              lastMessageOverall.senderType === "support" &&
              lastMessageOverall.senderId !== "ai-support-system" &&
              lastMessageOverall.senderName !== "AI Support Assistant"
            ) {
              return {
                ticket,
                lastSupportMessage,
              } as SupportReplyCardData;
            }
          }

          return null;
        } catch (error) {
          console.error(`Error fetching data for ticket ${ticketId}:`, error);
          return null;
        }
      });

      const cardResults = await Promise.all(cardPromises);
      const validCards = cardResults.filter(
        (card): card is SupportReplyCardData => card !== null
      );

      setCards(validCards);
    } catch (error) {
      console.error("Error fetching support reply cards:", error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [callApi, userId]);

  // Refresh cards when unread ticket IDs change
  useEffect(() => {
    fetchSupportReplyCards();
  }, [fetchSupportReplyCards]);

  // Listen for ticket notification updates via Socket.IO
  useEffect(() => {
    if (!userId) return;

    const socketUrl = config.api_server;
    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("✅ Support reply cards socket connected:", socket.id);
    });

    // Listen for ticket notification updates (same event as useTicketNotifications)
    const handleNotificationUpdate = () => {
      console.log(
        "🔔 Ticket notifications updated, refreshing support reply cards"
      );
      // Small delay to ensure backend has updated unread status
      setTimeout(() => {
        fetchSupportReplyCards();
      }, 300);
    };

    socket.on(
      `user:${userId}:ticket_notifications_updated`,
      handleNotificationUpdate
    );

    return () => {
      socket.off(
        `user:${userId}:ticket_notifications_updated`,
        handleNotificationUpdate
      );
      socket.disconnect();
    };
  }, [userId, fetchSupportReplyCards]);

  // Dismiss a card
  const dismissCard = useCallback((ticketId: number) => {
    const currentDismissedIds = dismissedIdsRef.current;
    if (currentDismissedIds.includes(ticketId)) {
      return; // Already dismissed
    }
    const newDismissedIds = [...currentDismissedIds, ticketId];
    setDismissedIds(newDismissedIds);
    dismissedIdsRef.current = newDismissedIds;
    saveDismissedIds(newDismissedIds);
    // Remove card from state immediately
    setCards((prev) => prev.filter((card) => card.ticket.id !== ticketId));
  }, []);

  // Clear dismissed IDs (useful for testing or reset)
  const clearDismissedIds = useCallback(() => {
    setDismissedIds([]);
    saveDismissedIds([]);
  }, []);

  return {
    cards,
    isLoading,
    dismissCard,
    refreshCards: fetchSupportReplyCards,
    clearDismissedIds,
  };
};
