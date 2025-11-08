import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CheckIcon from "@mui/icons-material/Check";
import CloseIconSmall from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import MicIcon from "@mui/icons-material/Mic";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { printHouseProfile } from "@/store/print-house-profile";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  createTicket,
  addTicketMessage,
  getTickets,
  getTicketMessages,
  getTicketById,
  markTicketAsRead,
  Ticket,
  TicketMessage,
} from "@/services/api-service/tickets/tickets-api";
import { useTicketChatSocket } from "./use-ticket-chat-socket";
import { useRemoteSessionSocket } from "./use-remote-session-socket";
import { useHuddleSocket } from "./use-huddle-socket";
import { useWebRTCSender } from "./use-webrtc-sender";
import { useWebRTCAudioSender } from "./use-webrtc-audio-sender";
import { useTicketNotifications } from "./use-ticket-notifications";
import DrawingOverlay, { applyDrawingToOverlay } from "./DrawingOverlay";
import { HuddleControls } from "./HuddleControls";
import { playNotificationSound } from "./play-notification-sound";
import { useTicketChatbot } from "./ticket-chatbot-context";
import { useRequestNotification } from "./request-notification-context";
import io, { Socket } from "socket.io-client";
import config from "@/config";

interface TicketChatbotSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIN_WIDTH = 400;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 500;

export const TicketChatbotSidebar = ({
  isOpen,
  onClose,
}: TicketChatbotSidebarProps) => {
  const { t } = useTranslation();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [remoteSessionRequest, setRemoteSessionRequest] = useState<{
    ticketId: number;
    requestedBy: string;
    sessionId: string;
  } | null>(null);
  const [huddleRequest, setHuddleRequest] = useState<{
    ticketId: number;
    requestedBy: string;
    sessionId: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const remoteSessionRequestRef = useRef<HTMLDivElement>(null);
  const huddleRequestRef = useRef<HTMLDivElement>(null);
  const sentMessageIdsRef = useRef<Set<number>>(new Set());
  const sidebarRef = useRef<HTMLDivElement>(null);
  const userProfile = useRecoilValue(userProfileState);
  const printHouse = useRecoilValue(printHouseProfile);
  const { callApi } = useGomakeAxios();
  const { unreadTicketIds, firstUnreadTicketId, refreshNotifications } = useTicketNotifications();
  const { setNavigateToTicketCallback } = useTicketChatbot();
  const { getAcceptedRequest, removeAcceptedRequest } = useRequestNotification();

  // Fetch tickets history
  const fetchTickets = useCallback(async () => {
    try {
      setIsLoadingTickets(true);
      const data = await getTickets(callApi);
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoadingTickets(false);
    }
  }, [callApi]);

  // Load messages for a ticket
  const loadTicketMessages = useCallback(
    async (ticketId: number) => {
      try {
        setIsLoadingMessages(true);
        const messagesData = await getTicketMessages(callApi, ticketId);
        setMessages(messagesData);
        // Track all message IDs to prevent duplicates
        messagesData.forEach((msg) => {
          sentMessageIdsRef.current.add(msg.id);
        });
        // Find and set the current ticket
        let ticket = tickets.find((t) => t.id === ticketId);
        // If ticket not found in list, fetch it
        if (!ticket) {
          try {
            ticket = await getTicketById(callApi, ticketId);
          } catch (error) {
            console.error("Error fetching ticket:", error);
          }
        }
        if (ticket) {
          setCurrentTicket(ticket);
        }
      } catch (error) {
        console.error("Error loading ticket messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [callApi, tickets]
  );

  // Register navigation callback
  useEffect(() => {
    setNavigateToTicketCallback((ticketId: number) => {
      loadTicketMessages(ticketId);
    });
  }, [setNavigateToTicketCallback, loadTicketMessages]);

  // Load tickets when sidebar opens
  useEffect(() => {
    if (isOpen) {
      fetchTickets();
    }
  }, [isOpen, fetchTickets]);

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
      const exists = prev.some((msg) => {
        if (msg.id === newMessage.id) return true;
        if (
          msg.message === newMessage.message &&
          msg.senderType === newMessage.senderType &&
          Math.abs(
            new Date(msg.createdAt).getTime() -
              new Date(newMessage.createdAt).getTime()
          ) < 1000
        ) {
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

  // Memoize ticket IDs to avoid unnecessary re-renders
  const ticketIds = useMemo(() => 
    tickets.filter(t => t.id).map(t => t.id!),
    [tickets]
  );

  // Listen for ticket summary updates via Socket.IO
  useEffect(() => {
    if (!isOpen || ticketIds.length === 0) return;

    const socket: Socket = io(config.api_server, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Ticket summary socket connected:", socket.id);
    });

    // Listen for summary updates for all tickets
    const handleSummaryUpdate = (updatedTicket: Ticket) => {
      console.log("📝 Summary update received for ticket:", updatedTicket.id, updatedTicket.summary);
      setTickets((prev) =>
        prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      
      // If this is the current ticket, update it as well
      setCurrentTicket((prev) => {
        if (prev?.id === updatedTicket.id) {
          return updatedTicket;
        }
        return prev;
      });
    };

    // Subscribe to summary update events for all tickets
    ticketIds.forEach((ticketId) => {
      socket.on(`ticket:${ticketId}:summary_updated`, handleSummaryUpdate);
      socket.on(`ticket_updated_${ticketId}`, handleSummaryUpdate);
    });

    return () => {
      ticketIds.forEach((ticketId) => {
        socket.off(`ticket:${ticketId}:summary_updated`, handleSummaryUpdate);
        socket.off(`ticket_updated_${ticketId}`, handleSummaryUpdate);
      });
      socket.disconnect();
    };
  }, [isOpen, ticketIds]);

  // Listen for new ticket creation events (when user asks about different topic)
  useEffect(() => {
    if (!isOpen || (!userProfile?.userId && !userProfile?.id)) return;

    const userId = userProfile?.userId || userProfile?.id;
    if (!userId) return;

    const socket: Socket = io(config.api_server, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("New ticket creation socket connected:", socket.id);
    });

    const handleNewTicketCreated = async (data: {
      oldTicketId: number;
      newTicketId: number;
      newTicket: Ticket;
    }) => {
      console.log("🆕 New ticket created for different issue:", data);
      
      // Refresh tickets list to include the new ticket
      await fetchTickets();
      
      // Switch to the new ticket
      if (data.newTicket.id) {
        await loadTicketMessages(data.newTicket.id);
        console.log("✅ Switched to new ticket:", data.newTicket.id);
      }
    };

    // Listen for new ticket creation event for this user
    socket.on(`user:${userId}:new_ticket_created`, handleNewTicketCreated);

    return () => {
      socket.off(`user:${userId}:new_ticket_created`, handleNewTicketCreated);
      socket.disconnect();
    };
  }, [isOpen, userProfile?.userId, userProfile?.id, fetchTickets, loadTicketMessages]);

  // Set up remote session socket
  const senderRef = useRef<ReturnType<typeof useWebRTCSender> | null>(null);

  const { emitResponse, emitSignal } = useRemoteSessionSocket(
    currentTicket?.id,
    useCallback((request) => {
      console.log("📨 Remote session request received in chatbot:", request);
      setRemoteSessionRequest(request);
      // Play notification sound
      playNotificationSound();
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
    useCallback(
      (ended: { sessionId: string; endedBy: string; ticketId: number }) => {
        console.log("📨 Remote session ended received:", ended);
        if (remoteSessionRequest?.sessionId === ended.sessionId) {
          if (senderRef.current) {
            senderRef.current.stopScreenShare();
          }
          setRemoteSessionRequest(null);
        }
      },
      [remoteSessionRequest]
    ),
    useCallback(
      (drawing: {
        sessionId: string;
        type: "draw" | "erase" | "clear";
        x: number;
        y: number;
        prevX?: number;
        prevY?: number;
        color?: string;
        brushSize?: number;
      }) => {
        console.log("📨 Drawing data received:", drawing);
        if (remoteSessionRequest?.sessionId === drawing.sessionId) {
          applyDrawingToOverlay(drawing);
        }
      },
      [remoteSessionRequest]
    )
  );

  const handleReceiveSignal = useCallback(
    async (signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => {
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
      }
    },
    [remoteSessionRequest, currentTicket, callApi]
  );

  const sender = useWebRTCSender({
    sessionId: remoteSessionRequest?.sessionId || "",
    onReceiveSignal: handleReceiveSignal,
  });

  useEffect(() => {
    senderRef.current = sender;
  }, [sender]);

  // Set up huddle socket
  const huddleSenderRef = useRef<ReturnType<typeof useWebRTCAudioSender> | null>(null);

  const handleHuddleReceiveSignal = useCallback(
    async (signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => {
      console.log("📤 Huddle WebRTC signal from sender:", signal.type, {
        hasHuddleRequest: !!huddleRequest,
        hasCurrentTicket: !!currentTicket,
      });
      if (huddleRequest && currentTicket) {
        const signalToEmit = {
          sessionId: huddleRequest.sessionId,
          ...signal,
        };
        console.log("📤 Sending huddle signal via API:", signalToEmit);

        try {
          await callApi(
            "POST",
            `/api/tickets/${currentTicket.id}/huddle-signal`,
            signalToEmit
          );
          console.log("✅ Huddle signal sent via API");
        } catch (error) {
          console.error("❌ Error sending huddle signal via API:", error);
        }
      }
    },
    [huddleRequest, currentTicket, callApi]
  );

  const huddleSender = useWebRTCAudioSender({
    sessionId: huddleRequest?.sessionId || "",
    onReceiveSignal: handleHuddleReceiveSignal,
  });

  useEffect(() => {
    huddleSenderRef.current = huddleSender;
  }, [huddleSender]);

  const { emitResponse: emitHuddleResponse, emitSignal: emitHuddleSignal } = useHuddleSocket(
    currentTicket?.id,
    useCallback((request) => {
      console.log("📨 Huddle request received in chatbot:", request);
      setHuddleRequest(request);
      // Play notification sound
      playNotificationSound();
    }, []),
    undefined,
    useCallback((signal: { type: "offer" | "answer" | "ice-candidate"; data: any }) => {
      if (!huddleRequest || !huddleSenderRef.current) return;

      if (signal.type === "answer") {
        huddleSenderRef.current.handleAnswer(signal.data);
      } else if (signal.type === "ice-candidate") {
        huddleSenderRef.current.handleIceCandidate(signal.data);
      }
    }, [huddleRequest]),
    useCallback(
      (ended: { sessionId: string; endedBy: string; ticketId: number }) => {
        console.log("📨 Huddle ended received:", ended);
        if (huddleRequest?.sessionId === ended.sessionId) {
          if (huddleSenderRef.current) {
            huddleSenderRef.current.stopAudio();
          }
          setHuddleRequest(null);
        }
      },
      [huddleRequest]
    )
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check for accepted requests when ticket loads (from modal acceptance)
  useEffect(() => {
    if (!currentTicket?.id) return;

    const acceptedRequest = getAcceptedRequest(currentTicket.id);
    if (!acceptedRequest) return;

    console.log("✅ Found accepted request for ticket:", currentTicket.id, acceptedRequest);

    if (acceptedRequest.type === "huddle") {
      // Set huddle request state first
      setHuddleRequest({
        ticketId: acceptedRequest.ticketId,
        requestedBy: acceptedRequest.requestedBy,
        sessionId: acceptedRequest.sessionId,
      });

      // Start audio automatically after hooks have updated
      // Use a longer delay and check multiple times to ensure huddleSender is ready
      let attempts = 0;
      const maxAttempts = 10;
      const checkAndStart = setInterval(async () => {
        attempts++;
        if (huddleSenderRef.current && huddleSenderRef.current.startAudio) {
          clearInterval(checkAndStart);
          try {
            await huddleSenderRef.current.startAudio();
            console.log("✅ Started huddle audio from accepted request");
            // Remove from accepted requests after successful start
            removeAcceptedRequest(currentTicket.id);
          } catch (error) {
            console.error("Error starting huddle audio:", error);
            // Still remove to prevent retry loops
            removeAcceptedRequest(currentTicket.id);
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(checkAndStart);
          console.warn("⚠️ Could not start huddle audio - huddleSender not ready after max attempts");
          removeAcceptedRequest(currentTicket.id);
        }
      }, 200);

    } else if (acceptedRequest.type === "remote_session") {
      // Set remote session request state
      setRemoteSessionRequest({
        ticketId: acceptedRequest.ticketId,
        requestedBy: acceptedRequest.requestedBy,
        sessionId: acceptedRequest.sessionId,
      });

      // Start screen share automatically after a short delay
      setTimeout(async () => {
        if (senderRef.current) {
          try {
            await senderRef.current.startScreenShare();
            console.log("✅ Started remote session from accepted request");
          } catch (error) {
            console.error("Error starting remote session:", error);
          }
        }
      }, 500);

      // Remove from accepted requests
      removeAcceptedRequest(currentTicket.id);
    }

    // Note: The interval clears itself after maxAttempts or success, so no cleanup needed
  }, [currentTicket?.id, getAcceptedRequest, removeAcceptedRequest]);

  // Scroll to top when remote session request appears
  useEffect(() => {
    if (remoteSessionRequest) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (remoteSessionRequestRef.current) {
            remoteSessionRequestRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          } else if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 150);
      });
    }
  }, [remoteSessionRequest]);

  // Scroll to top when huddle request appears
  useEffect(() => {
    if (huddleRequest && !huddleSender?.isConnected) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (huddleRequestRef.current) {
            huddleRequestRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          } else if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 150);
      });
    }
  }, [huddleRequest, huddleSender?.isConnected]);

  // Reset state when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentTicket(null);
      setMessages([]);
      setInputMessage("");
      sentMessageIdsRef.current.clear();
      setRemoteSessionRequest(null);
      setHuddleRequest(null);
      if (senderRef.current?.isSharing) {
        senderRef.current.stopScreenShare();
      }
      if (huddleSenderRef.current) {
        huddleSenderRef.current.stopAudio();
      }
    }
  }, [isOpen]);

  // Handle new ticket creation
  const handleNewTicket = useCallback(() => {
    setCurrentTicket(null);
    setMessages([]);
    setInputMessage("");
  }, []);

  // Handle ticket selection
  const handleTicketSelect = useCallback(
    async (ticket: Ticket) => {
      setCurrentTicket(ticket);
      await loadTicketMessages(ticket.id!);
      
      // Mark ticket as read when selected
      if (ticket.id && unreadTicketIds.has(ticket.id)) {
        try {
          await markTicketAsRead(callApi, ticket.id);
          refreshNotifications();
        } catch (error) {
          console.error("Error marking ticket as read:", error);
        }
      }
    },
    [loadTicketMessages, callApi, unreadTicketIds, refreshNotifications]
  );

  // Auto-open first unread ticket when sidebar opens and tickets are loaded
  useEffect(() => {
    if (isOpen && tickets.length > 0 && firstUnreadTicketId && !currentTicket) {
      const unreadTicket = tickets.find((t) => t.id === firstUnreadTicketId);
      if (unreadTicket) {
        handleTicketSelect(unreadTicket);
      }
    }
  }, [isOpen, tickets, firstUnreadTicketId, currentTicket, handleTicketSelect]);

  // Handle tab change
  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      if (newValue === 0) {
        // "New Ticket" tab
        handleNewTicket();
      } else {
        // Select ticket (newValue - 1 because tab 0 is "New Ticket")
        const ticket = tickets[newValue - 1];
        if (ticket) {
          handleTicketSelect(ticket);
        }
      }
    },
    [tickets, handleTicketSelect, handleNewTicket]
  );

  // Get current tab index
  const getCurrentTabIndex = () => {
    if (!currentTicket) return 0; // "New Ticket" tab
    const index = tickets.findIndex((t) => t.id === currentTicket.id);
    return index >= 0 ? index + 1 : 0;
  };

  const handleAcceptRemoteSession = useCallback(async () => {
    if (!remoteSessionRequest || !currentTicket || !senderRef.current) return;

    emitResponse({
      ticketId: remoteSessionRequest.ticketId,
      sessionId: remoteSessionRequest.sessionId,
      accepted: true,
      userId: userProfile?.userId || userProfile?.id || "",
    });

    try {
      await senderRef.current.startScreenShare();
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  }, [remoteSessionRequest, currentTicket, emitResponse, userProfile]);

  const handleRejectRemoteSession = useCallback(() => {
    if (!remoteSessionRequest) return;

    emitResponse({
      ticketId: remoteSessionRequest.ticketId,
      sessionId: remoteSessionRequest.sessionId,
      accepted: false,
      userId: userProfile?.userId || userProfile?.id || "",
    });

    setRemoteSessionRequest(null);
  }, [remoteSessionRequest, emitResponse, userProfile]);

  const handleAcceptHuddle = useCallback(async () => {
    if (!huddleRequest || !currentTicket || !huddleSenderRef.current) return;

    const responseData = {
      ticketId: huddleRequest.ticketId,
      sessionId: huddleRequest.sessionId,
      accepted: true,
      userId: userProfile?.userId || userProfile?.id || "",
    };

    // Emit via Socket.IO (for real-time)
    emitHuddleResponse(responseData);

    // Also send via API to ensure backend relays it
    try {
      await callApi(
        "POST",
        `/api/tickets/${currentTicket.id}/huddle-response`,
        responseData
      );
      console.log("✅ Huddle response sent via API");
    } catch (error) {
      console.error("❌ Error sending huddle response via API:", error);
    }

    try {
      await huddleSenderRef.current.startAudio();
    } catch (error) {
      console.error("Error starting audio:", error);
    }
  }, [huddleRequest, currentTicket, emitHuddleResponse, userProfile, callApi]);

  const handleRejectHuddle = useCallback(async () => {
    if (!huddleRequest || !currentTicket) return;

    const responseData = {
      ticketId: huddleRequest.ticketId,
      sessionId: huddleRequest.sessionId,
      accepted: false,
      userId: userProfile?.userId || userProfile?.id || "",
    };

    // Emit via Socket.IO (for real-time)
    emitHuddleResponse(responseData);

    // Also send via API to ensure backend relays it
    try {
      await callApi(
        "POST",
        `/api/tickets/${currentTicket.id}/huddle-response`,
        responseData
      );
      console.log("✅ Huddle rejection sent via API");
    } catch (error) {
      console.error("❌ Error sending huddle rejection via API:", error);
    }

    setHuddleRequest(null);
  }, [huddleRequest, currentTicket, emitHuddleResponse, userProfile, callApi]);

  const handleEndHuddle = useCallback(() => {
    if (huddleSenderRef.current) {
      huddleSenderRef.current.stopAudio();
    }
    setHuddleRequest(null);
  }, []);

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
      if (!currentTicket) {
        setIsCreatingTicket(true);
        const username = getUsername();
        const ticketData = {
          title: `Quick Support - ${new Date().toLocaleDateString()}`,
          priority: "medium",
          printHouseId: printHouse?.id || "",
          printHouseName: printHouse?.name || "",
          createdByUserId: userProfile?.userId || userProfile?.id || "",
          username: username,
        };

        const ticket = await createTicket(callApi, ticketData);
        
        // Refresh tickets list first, then set current ticket
        await fetchTickets();
        
        // Find the ticket in the updated list (it should be first since it's newest)
        setCurrentTicket(ticket);

        const firstMessage = await addTicketMessage(
          callApi,
          ticket.id!,
          messageText,
          "user",
          username
        );

        sentMessageIdsRef.current.add(firstMessage.id);
        setMessages([firstMessage]);
        setIsCreatingTicket(false);
      } else {
        setIsSending(true);
        const username = getUsername();
        const newMessage = await addTicketMessage(
          callApi,
          currentTicket.id!,
          messageText,
          "user",
          username
        );

        sentMessageIdsRef.current.add(newMessage.id);
        setMessages((prev) => [...prev, newMessage]);
        setIsSending(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsCreatingTicket(false);
      setIsSending(false);
      setInputMessage(messageText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      
      const containerRect = sidebarRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      setWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "success";
      case "ai_processing":
        return "info";
      case "in_progress":
        return "warning";
      case "resolved":
        return "default";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Box
        ref={sidebarRef}
        sx={{
          width: `${width}px`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderLeft: "1px solid #e0e0e0",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Resize handle */}
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "4px",
            height: "100%",
            cursor: "col-resize",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
            zIndex: 10,
          }}
        />

        {/* Header */}
        <Box
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 64,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SupportAgentIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("tickets.support") || "Support"}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs for Ticket History */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "white" }}>
          <Tabs
            value={getCurrentTabIndex()}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 48,
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontSize: "0.875rem",
              },
            }}
          >
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <AddIcon fontSize="small" />
                  <Typography variant="body2">New Ticket</Typography>
                </Stack>
              }
            />
            {tickets.map((ticket) => {
              const hasUnread = ticket.id ? unreadTicketIds.has(ticket.id) : false;
              return (
                <Tab
                  key={ticket.id}
                  label={
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={!hasUnread}
                      sx={{
                        "& .MuiBadge-dot": {
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 150,
                            fontWeight: hasUnread ? 600 : 400,
                          }}
                        >
                          {ticket.summary || ticket.title}
                        </Typography>
                        <Chip
                          label={ticket.status}
                          size="small"
                          color={getStatusColor(ticket.status) as any}
                          sx={{ height: 20, fontSize: "0.65rem" }}
                        />
                      </Stack>
                    </Badge>
                  }
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Chat Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Messages Area */}
          <Box
            ref={messagesContainerRef}
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
            {isLoadingMessages ? (
              <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                <CircularProgress size={40} />
              </Stack>
            ) : isCreatingTicket ? (
              <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
                  {t("tickets.creatingTicket") || "Creating ticket..."}
                </Typography>
              </Stack>
            ) : (
              <>
                {/* Remote Session Request Card */}
                {remoteSessionRequest && (
                  <Box
                    ref={remoteSessionRequestRef}
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
                      <SupportAgentIcon
                        sx={{ fontSize: 40, color: "#1976d2", mb: 1 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Remote Session Request
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                        Support wants to view your screen. Click "Accept" to start
                        sharing or "Reject" to decline.
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
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mt: 2, color: "#4caf50" }}
                        >
                          Screen sharing active...
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Huddle Request Card */}
                {huddleRequest && !huddleSender?.isConnected && (
                  <Box
                    ref={huddleRequestRef}
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
                        border: "2px solid #4caf50",
                      }}
                    >
                      <MicIcon
                        sx={{ fontSize: 40, color: "#4caf50", mb: 1 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Huddle Request
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                        Support wants to start a voice call. Click "Accept" to start
                        the huddle or "Reject" to decline.
                      </Typography>
                      <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={handleAcceptHuddle}
                          size="small"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CloseIconSmall />}
                          onClick={handleRejectHuddle}
                          size="small"
                        >
                          Reject
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                )}

                {/* Huddle Controls */}
                {huddleSender?.isConnected && (
                  <HuddleControls
                    isConnected={huddleSender.isConnected}
                    isMuted={huddleSender.isMuted}
                    error={huddleSender.error}
                    onToggleMute={huddleSender.toggleMute}
                    onEndHuddle={handleEndHuddle}
                    remoteAudioRef={huddleSender.remoteAudioRef}
                  />
                )}

                {/* Messages */}
                {messages.length === 0 ? (
                  <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                    <SupportAgentIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", textAlign: "center" }}
                    >
                      {currentTicket
                        ? t("tickets.startConversation") ||
                          "Start a conversation with our support team"
                        : t("tickets.selectTicket") ||
                          "Select a ticket or start a new conversation"}
                    </Typography>
                  </Stack>
                ) : (
                  messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          message.senderType === "user" ? "flex-end" : "flex-start",
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
                {isSending ? <CircularProgress size={20} /> : <SendIcon />}
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
        </Box>
      </Box>

      {/* Drawing Overlay - shown when screen sharing is active */}
      {sender.isSharing && (
        <DrawingOverlay
          isSharing={sender.isSharing}
          onDrawing={() => {
            // Drawing is handled via socket callback
          }}
        />
      )}
    </>
  );
};

