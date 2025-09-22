import { io, Socket } from "socket.io-client";
import config from "@/config";
import { getUserToken } from "@/services/storage-data";
import {
  DMSendMessageEvent,
  DMMessageConfirmedEvent,
  DMNewMessageEvent,
  DMTypingEvent,
  DMUserTypingEvent,
  DMMarkAsReadEvent,
  DMMessageReadEvent,
  JoinConversationEvent,
  DMPresenceData,
} from "@/widgets/frontdesk/providers/internal/types/direct-messages.types";

export type DMMessageEventHandler = (message: DMNewMessageEvent) => void;
export type DMMessageConfirmedHandler = (data: DMMessageConfirmedEvent) => void;
export type DMTypingEventHandler = (data: DMUserTypingEvent) => void;
export type DMPresenceEventHandler = (data: any) => void;
export type DMConnectionEventHandler = (connected: boolean) => void;
export type DMErrorEventHandler = (error: string) => void;

export class DirectMessagesWebSocketService {
  private socket: Socket | null = null;
  private serverUrl: string;
  private isConnecting: boolean = false;

  constructor() {
    this.serverUrl = config.messaging_server || config.api_server;
  }

  // Generate a persistent session ID for better connection tracking
  private generateSessionId(): string {
    const existingSessionId = localStorage.getItem('dm_session_id');
    if (existingSessionId) {
      return existingSessionId;
    }
    
    const sessionId = `dm_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('dm_session_id', sessionId);
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
      console.log("DM WebSocket Service - Auth Token:", token ? "Present" : "Missing");
      if (!token) {
        this.isConnecting = false;
        console.error("DM WebSocket Service - No authentication token available");
        reject(new Error("No authentication token available"));
        return;
      }

      console.log("DM WebSocket Service - Connecting to:", `${this.serverUrl}/messaging`);
      this.socket = io(`${this.serverUrl}/messaging`, {
        auth: {
          token: token,
          sessionId: this.generateSessionId(),
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
        reconnectionDelayMax: 5000,
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        console.log("Connected to DM messaging service");
        this.isConnecting = false;
        resolve(this.socket!);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from DM messaging service. Reason:", reason);
        this.isConnecting = false;
      });

      this.socket.on("connect_error", (error) => {
        console.error("DM Connection error:", error.message);
        this.isConnecting = false;
        
        if (error.message.includes('Authentication')) {
          console.error("DM Authentication failed - token may be invalid or expired");
          localStorage.removeItem('dm_session_id');
        } else if (error.message.includes('timeout')) {
          console.error("DM Connection timeout - server may be unreachable");
        } else if (error.message.includes('ECONNREFUSED')) {
          console.error("DM Connection refused - server is not running");
        }
        
        reject(error);
      });

      this.socket.on("error", (error) => {
        console.error("DM Socket error:", error);
      });

      this.socket.on("exception", (error) => {
        console.error("DM Socket exception:", error);
      });

      this.socket.on("reconnect", (attemptNumber) => {
        console.log(`DM Reconnected after ${attemptNumber} attempts`);
      });

      this.socket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`DM Reconnection attempt ${attemptNumber}`);
      });

      this.socket.on("reconnect_error", (error) => {
        console.error("DM Reconnection error:", error);
      });

      this.socket.on("reconnect_failed", () => {
        console.error("DM Failed to reconnect after maximum attempts");
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

  // Join a conversation room to receive its live updates
  joinConversation(data: JoinConversationEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        console.error("[DM WebSocket] Cannot join conversation - socket not connected");
        reject(new Error("Socket not connected"));
        return;
      }

      console.log("[DM WebSocket] Joining conversation:", data.conversationId);
      this.socket.emit("joinConversation", data, (response: any) => {
        console.log("[DM WebSocket] Join conversation response:", response);
        if (response?.success !== false) {
          resolve();
        } else {
          reject(new Error(response?.error || "Failed to join conversation"));
        }
      });
    });
  }

  // Leave a conversation room
  leaveConversation(data: JoinConversationEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("leaveConversation", data, (response: any) => {
        if (response?.success !== false) {
          resolve();
        } else {
          reject(new Error(response?.error || "Failed to leave conversation"));
        }
      });
    });
  }

  // Send message (real-time)
  sendMessage(data: DMSendMessageEvent): void {
    if (!this.socket?.connected) {
      console.error("DM Socket not connected - message will not be sent");
      return;
    }

    console.log("[DM WebSocket] Emitting dm:sendMessage event with data:", data);
    this.socket.emit("dm:sendMessage", data);
  }

  // Typing indicators
  startTyping(data: DMTypingEvent): void {
    if (this.socket?.connected) {
      this.socket.emit("dm:typingStart", data);
    }
  }

  stopTyping(data: DMTypingEvent): void {
    if (this.socket?.connected) {
      this.socket.emit("dm:typingStop", data);
    }
  }

  // Read receipts
  markAsRead(data: DMMarkAsReadEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("dm:markAsRead", data, (response: any) => {
        if (response?.success !== false) {
          resolve();
        } else {
          reject(new Error(response?.error || "Failed to mark as read"));
        }
      });
    });
  }

  // Presence operations
  getPresence(userIds?: string[]): Promise<Record<string, DMPresenceData>> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.socket.emit("getPresence", { userIds }, (response: any) => {
        if (response?.success !== false && response?.presence) {
          resolve(response.presence);
        } else {
          reject(new Error(response?.error || "Failed to get presence"));
        }
      });
    });
  }

  // Event listeners
  onNewMessage(handler: DMMessageEventHandler): void {
    if (this.socket) {
      this.socket.on("dm:newMessage", handler);
    }
  }

  onMessageConfirmed(handler: DMMessageConfirmedHandler): void {
    if (this.socket) {
      this.socket.on("dm:messageConfirmed", handler);
    }
  }

  onUserTyping(handler: DMTypingEventHandler): void {
    if (this.socket) {
      this.socket.on("dm:userTyping", handler);
    }
  }

  onMessageRead(handler: (data: DMMessageReadEvent) => void): void {
    if (this.socket) {
      this.socket.on("dm:messageRead", handler);
    }
  }
  
  onConversationUpdated(handler: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("dm:conversationUpdated", handler);
    }
  }

  onUserOnline(handler: DMPresenceEventHandler): void {
    if (this.socket) {
      this.socket.on("userOnline", handler);
    }
  }

  onUserOffline(handler: DMPresenceEventHandler): void {
    if (this.socket) {
      this.socket.on("userOffline", handler);
    }
  }

  onConnect(handler: DMConnectionEventHandler): void {
    if (this.socket) {
      this.socket.on("connect", () => handler(true));
    }
  }

  onDisconnect(handler: DMConnectionEventHandler): void {
    if (this.socket) {
      this.socket.on("disconnect", () => handler(false));
    }
  }

  onError(handler: DMErrorEventHandler): void {
    if (this.socket) {
      this.socket.on("connect_error", (error: Error) => handler(error.message));
      this.socket.on("exception", (error: any) => handler(error.message || "Socket exception"));
    }
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
export const directMessagesWebSocketService = new DirectMessagesWebSocketService();