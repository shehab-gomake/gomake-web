import { useState, useEffect, useRef, useCallback } from "react";
import { IconButton, Box, Paper, TextField, Stack, Typography, Avatar, CircularProgress, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CheckIcon from "@mui/icons-material/Check";
import CloseIconSmall from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { printHouseProfile } from "@/store/print-house-profile";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { createTicket, addTicketMessage, Ticket, TicketMessage } from "@/services/api-service/tickets/tickets-api";
import { useTicketChatSocket } from "./use-ticket-chat-socket";
import { useRemoteSessionSocket } from "./use-remote-session-socket";
import { useWebRTCSender } from "./use-webrtc-sender";
import DrawingOverlay, { applyDrawingToOverlay } from "./DrawingOverlay";

interface TicketChatbotWidgetProps {
  position?: "bottom-right" | "bottom-left";
}

export const TicketChatbotWidget = ({ position = "bottom-right" }: TicketChatbotWidgetProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [remoteSessionRequest, setRemoteSessionRequest] = useState<{
    ticketId: number;
    requestedBy: string;
    sessionId: string;
  } | null>(null);
  // Removed isSharingScreen state - use sender.isSharing directly to avoid infinite loops
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Track message IDs we've added from API responses to prevent Socket.IO duplicates
  const sentMessageIdsRef = useRef<Set<number>>(new Set());
  const userProfile = useRecoilValue(userProfileState);
  const printHouse = useRecoilValue(printHouseProfile);
  const { callApi } = useGomakeAxios();

  // Stable callback for Socket.IO that has access to sentMessageIdsRef
  const handleSocketMessage = useCallback((newMessage: TicketMessage) => {
    // CRITICAL: Skip ALL user messages from Socket.IO - we only add them from API responses
    if (newMessage.senderType === "user") {
      console.log("Widget: Skipping user message from Socket.IO:", newMessage.id);
      return;
    }
    
    // Skip if this is a message we just sent (tracked by ID)
    if (sentMessageIdsRef.current.has(newMessage.id)) {
      console.log("Skipping duplicate message from Socket.IO:", newMessage.id);
      return;
    }
    
    setMessages((prev) => {
      // Avoid duplicates by checking if message already exists
      // Check by ID first, then by content and timestamp as fallback
      const exists = prev.some((msg) => {
        if (msg.id === newMessage.id) return true;
        // Also check by content and timestamp to catch duplicates even if IDs differ
        if (msg.message === newMessage.message && 
            msg.senderType === newMessage.senderType &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000) {
          return true;
        }
        return false;
      });
      if (exists) {
        console.log("Skipping duplicate message (already exists):", newMessage.id);
        return prev;
      }
      return [...prev, newMessage];
    });
  }, []);

  // Use Socket.IO hook to listen for new messages
  useTicketChatSocket(currentTicket?.id, sentMessageIdsRef, handleSocketMessage);

  // Set up remote session socket first
  const senderRef = useRef<ReturnType<typeof useWebRTCSender> | null>(null);
  
  const { emitResponse, emitSignal } = useRemoteSessionSocket(
    currentTicket?.id,
    useCallback((request) => {
      console.log("📨 Remote session request received in chatbot:", request);
      // Show remote session request to user
      setRemoteSessionRequest(request);
    }, []),
    undefined,
    useCallback((signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => {
      if (!remoteSessionRequest || !senderRef.current) return;
      
      if (signal.type === "answer") {
        senderRef.current.handleAnswer(signal.data);
      } else if (signal.type === "ice-candidate") {
        senderRef.current.handleIceCandidate(signal.data);
      }
    }, [remoteSessionRequest]),
    useCallback((ended: { sessionId: string; endedBy: string; ticketId: number }) => {
      console.log("📨 Remote session ended received:", ended);
      // Only handle if it's for the current session
      if (remoteSessionRequest?.sessionId === ended.sessionId) {
        // Stop screen sharing
        if (senderRef.current) {
          senderRef.current.stopScreenShare();
        }
        // Clear remote session state
        setRemoteSessionRequest(null);
      }
    }, [remoteSessionRequest]),
    useCallback((drawing: { sessionId: string; type: 'draw' | 'erase' | 'clear'; x: number; y: number; prevX?: number; prevY?: number; color?: string; brushSize?: number }) => {
      console.log("📨 Drawing data received:", drawing);
      // Only handle if it's for the current session
      if (remoteSessionRequest?.sessionId === drawing.sessionId) {
        applyDrawingToOverlay(drawing);
      }
    }, [remoteSessionRequest])
  );

  // Debug: Log when remoteSessionRequest changes
  useEffect(() => {
    console.log("🔍 Remote session request state:", remoteSessionRequest);
    console.log("🔍 Current ticket:", currentTicket);
    console.log("🔍 Should show buttons:", !!remoteSessionRequest);
    if (remoteSessionRequest) {
      console.log("✅ Remote session request state updated:", remoteSessionRequest);
    }
  }, [remoteSessionRequest, currentTicket]);

  // Debug: Log when ticket changes
  useEffect(() => {
    console.log("🔍 Current ticket ID changed:", currentTicket?.id);
  }, [currentTicket?.id]);

  // Memoize the signal handler to prevent recreating sender on every render
  const handleReceiveSignal = useCallback(async (signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => {
    console.log("📤 WebRTC signal from sender:", signal.type, {
      hasRemoteSessionRequest: !!remoteSessionRequest,
      hasCurrentTicket: !!currentTicket,
    });
    if (remoteSessionRequest && currentTicket) {
      const signalToEmit = {
        sessionId: remoteSessionRequest.sessionId,
        ...signal,
      };
      console.log("📤 Sending signal via API:", signalToEmit);
      
      // Send signal via API endpoint (backend will relay via Socket.IO)
      try {
        await callApi(
          "POST",
          `/api/tickets/${currentTicket.id}/remote-session-signal`,
          signalToEmit
        );
        console.log("✅ Signal sent via API");
      } catch (error) {
        console.error("❌ Error sending signal via API:", error);
      }
    } else {
      console.warn("⚠️ Cannot emit signal - missing dependencies:", {
        remoteSessionRequest: !!remoteSessionRequest,
        currentTicket: !!currentTicket,
      });
    }
  }, [remoteSessionRequest, currentTicket, callApi]);

  // Set up WebRTC sender with memoized callback
  const sender = useWebRTCSender({
    sessionId: remoteSessionRequest?.sessionId || "",
    onReceiveSignal: handleReceiveSignal,
  });

  // Update sender ref when sender changes
  useEffect(() => {
    senderRef.current = sender;
  }, [sender]);

  // Handle WebRTC signaling from socket
  const handleSignal = useCallback((signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => {
    if (!remoteSessionRequest || !senderRef.current) return;
    
    if (signal.type === "answer") {
      senderRef.current.handleAnswer(signal.data);
    } else if (signal.type === "ice-candidate") {
      senderRef.current.handleIceCandidate(signal.data);
    }
  }, [remoteSessionRequest]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset state when chatbot closes to start fresh next time
  useEffect(() => {
    if (!isOpen) {
      setCurrentTicket(null);
      setMessages([]);
      setInputMessage("");
      sentMessageIdsRef.current.clear();
      setRemoteSessionRequest(null);
      if (senderRef.current?.isSharing) {
        senderRef.current.stopScreenShare();
      }
    }
  }, [isOpen]);

  // Handle accept remote session
  const handleAcceptRemoteSession = useCallback(async () => {
    if (!remoteSessionRequest || !currentTicket || !senderRef.current) return;

    // Emit acceptance response
    emitResponse({
      ticketId: remoteSessionRequest.ticketId,
      sessionId: remoteSessionRequest.sessionId,
      accepted: true,
      userId: userProfile?.userId || userProfile?.id || "",
    });

    // Start screen sharing
    try {
      await senderRef.current.startScreenShare();
      // isSharing state is managed by the sender hook
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  }, [remoteSessionRequest, currentTicket, emitResponse, userProfile]);

  // Handle reject remote session
  const handleRejectRemoteSession = useCallback(() => {
    if (!remoteSessionRequest) return;

    // Emit rejection response
    emitResponse({
      ticketId: remoteSessionRequest.ticketId,
      sessionId: remoteSessionRequest.sessionId,
      accepted: false,
      userId: userProfile?.userId || userProfile?.id || "",
    });

    setRemoteSessionRequest(null);
  }, [remoteSessionRequest, emitResponse, userProfile]);

  const getUsername = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return userProfile?.email || "Unknown";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage("");

    try {
      // If no ticket exists, create one with the first message
      if (!currentTicket) {
        setIsCreatingTicket(true);
        const username = getUsername();
        const ticketData = {
          title: `Quick Support - ${new Date().toLocaleDateString()}`,
          // Don't pass description - we'll add the message manually to avoid duplication
          priority: "medium",
          printHouseId: printHouse?.id || "",
          printHouseName: printHouse?.name || "",
          createdByUserId: userProfile?.userId || userProfile?.id || "",
          username: username,
        };

        const ticket = await createTicket(callApi, ticketData);
        setCurrentTicket(ticket);

        // Add the first message to the ticket manually
        const firstMessage = await addTicketMessage(
          callApi,
          ticket.id!,
          messageText,
          "user",
          username
        );

        // Track this message ID IMMEDIATELY to prevent Socket.IO duplicate
        sentMessageIdsRef.current.add(firstMessage.id);
        console.log("Added first message ID to tracking:", firstMessage.id);
        
        setMessages([firstMessage]);
        setIsCreatingTicket(false);
      } else {
        // Add message to existing ticket
        setIsSending(true);
        const username = getUsername();
        const newMessage = await addTicketMessage(
          callApi,
          currentTicket.id!,
          messageText,
          "user",
          username
        );
        
        // Track this message ID IMMEDIATELY to prevent Socket.IO duplicate
        sentMessageIdsRef.current.add(newMessage.id);
        console.log("Added message ID to tracking:", newMessage.id);
        
        setMessages((prev) => [...prev, newMessage]);
        setIsSending(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsCreatingTicket(false);
      setIsSending(false);
      // Restore input message on error
      setInputMessage(messageText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // State will be reset by useEffect when isOpen becomes false
  };

  const positionStyles: Record<string, { bottom: string; right?: string; left?: string }> = {
    "bottom-right": { bottom: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
  };

  return (
    <Box
      sx={{
        position: "fixed",
        ...positionStyles[position],
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            width: 380,
            height: 600,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <SupportAgentIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t("tickets.support") || "Support"}
              </Typography>
            </Stack>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 2,
              backgroundColor: "#f5f5f5",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {isCreatingTicket ? (
              <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
                  {t("tickets.creatingTicket") || "Creating ticket..."}
                </Typography>
              </Stack>
            ) : (
              <>
                {/* Remote Session Request Card - shown when request is active */}
                {remoteSessionRequest && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 2,
                        padding: 2,
                        textAlign: "center",
                        maxWidth: "90%",
                        boxShadow: 2,
                        border: "2px solid #1976d2",
                      }}
                    >
                      <SupportAgentIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Remote Session Request
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                        Support wants to view your screen. Click "Accept" to start sharing or "Reject" to decline.
                      </Typography>
                      <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CheckIcon />}
                          onClick={handleAcceptRemoteSession}
                          disabled={sender.isSharing}
                          size="small"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CloseIconSmall />}
                          onClick={handleRejectRemoteSession}
                          disabled={sender.isSharing}
                          size="small"
                        >
                          Reject
                        </Button>
                      </Stack>
                      {sender.isSharing && (
                        <Typography variant="caption" sx={{ display: "block", mt: 2, color: "#4caf50" }}>
                          Screen sharing active...
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Messages */}
                {messages.length === 0 ? (
                  <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                    <SupportAgentIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                    <Typography variant="body2" sx={{ color: "#666", textAlign: "center" }}>
                      {t("tickets.startConversation") || "Start a conversation with our support team"}
                    </Typography>
                  </Stack>
                ) : (
                  messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent: message.senderType === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  {message.senderType === "support" && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}>
                      <SupportAgentIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  )}
                  <Paper
                    elevation={1}
                    sx={{
                      maxWidth: "75%",
                      padding: 1.5,
                      backgroundColor:
                        message.senderType === "user" ? "#E3F2FD" : "white",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        fontWeight: 600,
                        marginBottom: 0.5,
                        color: "#1976d2",
                      }}
                    >
                      {message.senderType === "user"
                        ? t("tickets.you") || "You"
                        : message.senderName}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {message.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        marginTop: 0.5,
                        color: "#999",
                        fontSize: "0.7rem",
                      }}
                    >
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                  {message.senderType === "user" && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}>
                      {userProfile?.firstName?.[0] || userProfile?.email?.[0] || "U"}
                    </Avatar>
                  )}
                </Box>
                  ))
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              borderTop: "1px solid #e0e0e0",
              padding: 1.5,
              backgroundColor: "white",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                multiline
                maxRows={4}
                placeholder={t("tickets.typeMessage") || "Type a message..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isCreatingTicket || isSending}
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isCreatingTicket || isSending}
                sx={{ minWidth: 40 }}
              >
                {isSending ? (
                  <CircularProgress size={20} />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </Stack>
            {currentTicket && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  marginTop: 0.5,
                  color: "#999",
                  fontSize: "0.7rem",
                }}
              >
                {t("tickets.ticketId") || "Ticket"}: {currentTicket.ticketId}
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {/* Floating Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          width: 56,
          height: 56,
          backgroundColor: "#1976d2",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
      >
        {isOpen ? <CloseIcon /> : <SupportAgentIcon />}
      </IconButton>

      {/* Drawing Overlay - shown when screen sharing is active */}
      {sender.isSharing && (
        <DrawingOverlay
          isSharing={sender.isSharing}
          onDrawing={(drawing) => {
            // Drawing is handled via socket callback
            // This is just for the ref assignment
          }}
        />
      )}
    </Box>
  );
};
