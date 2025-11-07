import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import config from "@/config";
import { TicketMessage } from "@/services/api-service/tickets/tickets-api";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";

export const useTicketChatSocket = (
  ticketId: number | undefined,
  sentMessageIdsRef: React.MutableRefObject<Set<number>>,
  onNewMessage: (message: TicketMessage) => void
) => {
  const userProfile = useRecoilValue(userProfileState);
  
  // Use ref to always have the latest userProfile without recreating socket
  const userProfileRef = useRef(userProfile);
  useEffect(() => {
    userProfileRef.current = userProfile;
  }, [userProfile]);

  useEffect(() => {
    if (!ticketId) return;

    // Connect to Socket.IO server
    const socket: Socket = io(config.api_server, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Ticket chat socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Ticket chat socket disconnected");
    });

    // Listen for new messages for this specific ticket
    const eventName = `ticket:${ticketId}:message`;
    const handleMessage = (data: TicketMessage) => {
      const currentUser = userProfileRef.current;
      const currentUserId = currentUser?.userId || currentUser?.id;
      const currentUserEmail = currentUser?.email;
      
      // CRITICAL: Skip ALL user messages from Socket.IO - we only add them from API responses
      // This prevents duplicates since user messages are always added optimistically
      if (data.senderType === "user") {
        console.log("Socket.IO: Skipping user message (will be added from API):", data.id);
        return;
      }
      
      // First check: Skip if this message ID is in our sent messages Set
      if (sentMessageIdsRef.current.has(data.id)) {
        console.log("Socket.IO: Skipping message (already sent):", data.id);
        return;
      }
      
      // Second check: Only process messages that are NOT from the current user
      // Check both senderId and senderEmail, and handle string/number comparison
      const isFromCurrentUser = 
        (currentUserId && (
          String(data.senderId) === String(currentUserId) ||
          data.senderId === currentUserId ||
          data.senderId === String(currentUserId)
        )) ||
        (currentUserEmail && data.senderEmail === currentUserEmail);
      
      if (isFromCurrentUser) {
        console.log("Socket.IO: Skipping message (from current user):", data.id, data.senderId, currentUserId);
        return;
      }
      
      // This message is from admin or another user, process it
      console.log("Socket.IO: Processing message (from admin):", data.id);
      onNewMessage(data);
    };

    socket.on(eventName, handleMessage);

    // Listen for broadcast messages (when admin sends message)
    // Event name format: ticket_message_{ticketId}
    socket.on(`ticket_message_${ticketId}`, handleMessage);

    // Cleanup on unmount or ticket change
    return () => {
      socket.off(eventName, handleMessage);
      socket.off(`ticket_message_${ticketId}`, handleMessage);
      socket.disconnect();
    };
  }, [ticketId, sentMessageIdsRef, onNewMessage]);
};
