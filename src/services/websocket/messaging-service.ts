import { io, Socket } from "socket.io-client";
import config from "@/config";
import { getUserToken } from "@/services/storage-data";
import {
  Message,
  SendMessageData,
  JoinChannelData,
  TypingData,
  MarkAsReadData,
  UpdateStatusData,
  GetPresenceData,
  SocketResponse,
  PresenceData,
  TypingIndicator,
  MessageConfirmedData,
} from "@/widgets/frontdesk/providers/internal/types";

export type MessageEventHandler = (message: Message) => void;
export type PresenceEventHandler = (data: any) => void;
export type TypingEventHandler = (data: TypingIndicator) => void;
export type ConnectionEventHandler = (connected: boolean) => void;
export type ErrorEventHandler = (error: string) => void;
export type MessageConfirmedHandler = (data: MessageConfirmedData) => void;

export class MessagingService {
  private socket: Socket | null = null;
  private serverUrl: string;
  private isConnecting: boolean = false;

  constructor() {
    this.serverUrl = config.messaging_server || config.api_server;
  }

  // Generate a persistent session ID for better connection tracking
  // Based on Socket.IO knowledge base recommendation to avoid using ephemeral socket.id
  private generateSessionId(): string {
    const existingSessionId = localStorage.getItem('messaging_session_id');
    if (existingSessionId) {
      return existingSessionId;
    }
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('messaging_session_id', sessionId);
    return sessionId;
  }

  connect(authToken?: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      if (this.isConnecting) {
        reject(new Error("Connection already in progress"));
        return;
      }

      this.isConnecting = true;

      const token = authToken || getUserToken();
      console.log("Messaging Service - Auth Token:", token ? "Present" : "Missing");
      if (!token) {
        this.isConnecting = false;
        console.error("Messaging Service - No authentication token available");
        reject(new Error("No authentication token available"));
        return;
      }

      // Enhanced connection options based on Socket.IO knowledge base insights
      console.log("Messaging Service - Connecting to:", `${this.serverUrl}/messaging`);
      this.socket = io(`${this.serverUrl}/messaging`, {
        auth: {
          token: token,
          // Add session ID for better connection tracking (knowledge base recommendation)
          sessionId: this.generateSessionId(),
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
        // Enhanced reconnection strategy based on knowledge base
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 10,
        // Enable connection state recovery (knowledge base best practice)
        autoConnect: true,
        // Add ping/pong configuration for better connection monitoring
        pingTimeout: 60000,
        pingInterval: 25000,
      });

      this.socket.on("connect", () => {
        console.log("Connected to messaging service");
        this.isConnecting = false;
        resolve(this.socket!);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from messaging service. Reason:", reason);
        console.log("Disconnect details:", { reason, connected: this.socket?.connected });
        this.isConnecting = false;
      });

      // Enhanced error handling based on Socket.IO knowledge base insights
      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
        console.error("Error details:", error);
        this.isConnecting = false;
        
        // Enhanced error categorization based on knowledge base patterns
        if (error.message.includes('Authentication')) {
          console.error("Authentication failed - token may be invalid or expired");
          // Clear stored session on auth failure
          localStorage.removeItem('messaging_session_id');
        } else if (error.message.includes('timeout')) {
          console.error("Connection timeout - server may be unreachable");
        } else if (error.message.includes('ECONNREFUSED')) {
          console.error("Connection refused - server is not running");
        }
        
        reject(error);
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
        // Log additional context for debugging
        console.error("Socket state:", {
          connected: this.socket?.connected,
          id: this.socket?.id, // Note: ephemeral ID for debugging only
          transport: this.socket?.io.engine.transport.name
        });
      });

      this.socket.on("exception", (error) => {
        console.error("Socket exception:", error);
        // Handle server-side exceptions
        if (error.message) {
          console.error("Exception message:", error.message);
        }
      });

      // Add connection state recovery event handling (knowledge base best practice)
      this.socket.on("reconnect", (attemptNumber) => {
        console.log(`Reconnected after ${attemptNumber} attempts`);
      });

      this.socket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Reconnection attempt ${attemptNumber}`);
      });

      this.socket.on("reconnect_error", (error) => {
        console.error("Reconnection error:", error);
      });

      this.socket.on("reconnect_failed", () => {
        console.error("Failed to reconnect after maximum attempts");
        this.isConnecting = false;
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Message operations
  // Simplified one-step message sending
  sendMessage(data: SendMessageData): void {
    if (!this.socket?.connected) {
      console.error("Socket not connected - message will not be sent");
      return;
    }

    // Simply emit the message without waiting for confirmation
    // The backend will handle persistence and broadcasting
    this.socket.emit("sendMessage", data);
  }

  // Legacy promise-based method (kept for backwards compatibility if needed)
  sendMessageWithConfirmation(data: SendMessageData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("sendMessage", data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to send message"));
        }
      });
    });
  }

  // Channel operations
  joinChannel(data: JoinChannelData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("joinChannel", data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to join channel"));
        }
      });
    });
  }

  leaveChannel(data: JoinChannelData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("leaveChannel", data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to leave channel"));
        }
      });
    });
  }

  // Typing indicators
  startTyping(data: TypingData): void {
    if (this.socket?.connected) {
      this.socket.emit("typingStart", data);
    }
  }

  stopTyping(data: TypingData): void {
    if (this.socket?.connected) {
      this.socket.emit("typingStop", data);
    }
  }

  // Read receipts
  markAsRead(data: MarkAsReadData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("markAsRead", data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to mark as read"));
        }
      });
    });
  }

  // Presence operations
  updateStatus(data: UpdateStatusData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("updateStatus", data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to update status"));
        }
      });
    });
  }

  getPresence(data: GetPresenceData = {}): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("getPresence", data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to get presence"));
        }
      });
    });
  }

  // HTTP REST endpoint to fetch channel message history
  async fetchChannelMessages(
    channelId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ messages: Message[]; hasMore?: boolean; total?: number }> {
    const { limit = 50, offset = 0 } = options;
    const token = getUserToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (offset) params.append("offset", offset.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `${this.serverUrl}/messages/channel/${encodeURIComponent(channelId)}${queryString}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle the direct response from backend
      if (data && Array.isArray(data)) {
        // If direct array response
        return {
          messages: data,
          hasMore: false,
          total: data.length,
        };
      } else if (data.success !== false && data.messages && Array.isArray(data.messages)) {
        // If wrapped in success response
        return {
          messages: data.messages,
          hasMore: data.hasMore || false,
          total: data.total || data.messages.length,
        };
      } else if (data.success && data.data && Array.isArray(data.data)) {
        // If wrapped in data property
        return {
          messages: data.data,
          hasMore: data.hasMore || false,
          total: data.total || data.data.length,
        };
      } else {
        throw new Error(data.message || data.error || "Failed to fetch channel messages");
      }
    } catch (error: any) {
      console.error("Failed to fetch channel messages:", error);
      throw error;
    }
  }

  // Event listeners
  onNewMessage(handler: MessageEventHandler): void {
    if (this.socket) {
      this.socket.on("newMessage", handler);
    }
  }

  onDirectMessage(handler: MessageEventHandler): void {
    if (this.socket) {
      this.socket.on("directMessage", handler);
    }
  }

  onUserOnline(handler: PresenceEventHandler): void {
    if (this.socket) {
      this.socket.on("userOnline", handler);
    }
  }

  onUserOffline(handler: PresenceEventHandler): void {
    if (this.socket) {
      this.socket.on("userOffline", handler);
    }
  }

  onUserTyping(handler: TypingEventHandler): void {
    if (this.socket) {
      this.socket.on("userTyping", handler);
    }
  }

  onStatusChanged(handler: PresenceEventHandler): void {
    if (this.socket) {
      this.socket.on("statusChanged", handler);
    }
  }

  onMessageRead(handler: (data: { messageId: string; readBy: string; readAt: string }) => void): void {
    if (this.socket) {
      this.socket.on("messageRead", handler);
    }
  }

  onMessageConfirmed(handler: MessageConfirmedHandler): void {
    if (this.socket) {
      this.socket.on("messageConfirmed", handler);
    }
  }

  onConnect(handler: ConnectionEventHandler): void {
    if (this.socket) {
      this.socket.on("connect", () => handler(true));
    }
  }

  onDisconnect(handler: ConnectionEventHandler): void {
    if (this.socket) {
      this.socket.on("disconnect", () => handler(false));
    }
  }

  onError(handler: ErrorEventHandler): void {
    if (this.socket) {
      this.socket.on("connect_error", (error: Error) => handler(error.message));
      this.socket.on("exception", (error: any) => handler(error.message || "Socket exception"));
    }
  }

  // Channel management methods
  createChannel(data: { name: string; description?: string; isPrivate?: boolean }): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Not connected to messaging service"));
        return;
      }

      this.socket.emit("createChannel", data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to create channel"));
        }
      });
    });
  }

  getChannels(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Not connected to messaging service"));
        return;
      }

      this.socket.emit("getChannels", {}, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to get channels"));
        }
      });
    });
  }

  archiveConversation(channelId: string): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Not connected to messaging service"));
        return;
      }

      this.socket.emit("archiveConversation", { channelId }, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to archive conversation"));
        }
      });
    });
  }

  unarchiveConversation(channelId: string): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Not connected to messaging service"));
        return;
      }

      this.socket.emit("unarchiveConversation", { channelId }, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to unarchive conversation"));
        }
      });
    });
  }

  deleteConversation(channelId: string): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Not connected to messaging service"));
        return;
      }

      this.socket.emit("deleteConversation", { channelId }, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || "Failed to delete conversation"));
        }
      });
    });
  }

  // Remove event listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  removeListener(event: string, handler?: (...args: any[]) => void): void {
    if (this.socket) {
      if (handler) {
        this.socket.off(event, handler);
      } else {
        this.socket.removeAllListeners(event);
      }
    }
  }
}

// Singleton instance
export const messagingService = new MessagingService();
