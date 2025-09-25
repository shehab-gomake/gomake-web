import { io, Socket } from "socket.io-client";
import config from "@/config";
import { getUserToken } from "@/services/storage-data";
import {
  Message,
  JoinConversationPayload,
  JoinChannelPayload,
  SendMessagePayload,
  TypingPayload,
  MarkAsReadPayload,
  MessageConfirmedPayload,
  UserTypingPayload,
  ConversationUpdatedPayload
} from "@/types/frontdesk-types";

class MessagingWebSocketService {
  private socket: Socket | null = null;
  private connectionStatus: "connected" | "disconnected" | "connecting" = "disconnected";
  private messageHandlers: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeHandlers();
  }

  private initializeHandlers() {
    // Initialize handler sets for different event types
    const events = [
      "dm:newMessage",
      "dm:messageConfirmed",
      "dm:userTyping",
      "dm:conversationUpdated",
      "newMessage",
      "messageConfirmed",
      "userTyping",
      "connectionStatusChanged"
    ];

    events.forEach(event => {
      this.messageHandlers.set(event, new Set());
    });
  }

  // Connect to WebSocket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.connectionStatus = "connecting";
      this.notifyConnectionStatus("connecting");

      const userToken = getUserToken();
      if (!userToken) {
        reject(new Error("No user token available"));
        return;
      }

      const SERVER = config.api_server || "";

      this.socket = io(`${SERVER}/messaging`, {
        auth: {
          token: userToken
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts
      });

      this.setupEventListeners();

      this.socket.on("connect", () => {
        this.connectionStatus = "connected";
        this.reconnectAttempts = 0;
        this.notifyConnectionStatus("connected");
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        this.connectionStatus = "disconnected";
        this.notifyConnectionStatus("disconnected");

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error(`Failed to connect after ${this.maxReconnectAttempts} attempts: ${error.message}`));
        }
        this.reconnectAttempts++;
      });
    });
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus = "disconnected";
      this.notifyConnectionStatus("disconnected");
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on("disconnect", () => {
      this.connectionStatus = "disconnected";
      this.notifyConnectionStatus("disconnected");
    });

    this.socket.on("reconnect", () => {
      this.connectionStatus = "connected";
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus("connected");
    });

    // DM Events
    this.socket.on("dm:newMessage", (data: Message) => {
      this.notifyHandlers("dm:newMessage", data);
    });

    this.socket.on("dm:messageConfirmed", (data: MessageConfirmedPayload) => {
      this.notifyHandlers("dm:messageConfirmed", data);
    });

    this.socket.on("dm:userTyping", (data: UserTypingPayload) => {
      this.notifyHandlers("dm:userTyping", data);
    });

    this.socket.on("dm:conversationUpdated", (data: ConversationUpdatedPayload) => {
      this.notifyHandlers("dm:conversationUpdated", data);
    });

    // Channel Events
    this.socket.on("newMessage", (data: Message) => {
      this.notifyHandlers("newMessage", data);
    });

    this.socket.on("messageConfirmed", (data: MessageConfirmedPayload) => {
      this.notifyHandlers("messageConfirmed", data);
    });

    this.socket.on("userTyping", (data: UserTypingPayload) => {
      this.notifyHandlers("userTyping", data);
    });
  }

  // DM Methods
  joinConversation(payload: JoinConversationPayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("joinConversation", payload);
  }

  sendDMMessage(payload: SendMessagePayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("dm:sendMessage", payload);
  }

  startTypingDM(payload: TypingPayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("dm:typingStart", payload);
  }

  stopTypingDM(payload: TypingPayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("dm:typingStop", payload);
  }

  markAsRead(payload: MarkAsReadPayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("dm:markAsRead", payload);
  }

  // Channel Methods
  joinChannel(payload: JoinChannelPayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("joinChannel", payload);
  }

  leaveChannel(payload: JoinChannelPayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("leaveChannel", payload);
  }

  sendChannelMessage(payload: SendMessagePayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("sendMessage", payload);
  }

  startTypingChannel(payload: TypingPayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("typingStart", payload);
  }

  stopTypingChannel(payload: TypingPayload) {
    if (!this.socket?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit("typingStop", payload);
  }

  // Event Handler Management
  on(event: string, handler: Function) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.add(handler);
    }
  }

  off(event: string, handler: Function) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private notifyHandlers(event: string, data: any) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  private notifyConnectionStatus(status: string) {
    this.notifyHandlers("connectionStatusChanged", status);
  }

  // Utility Methods
  getConnectionStatus() {
    return this.connectionStatus;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
const messagingWebSocketService = new MessagingWebSocketService();
export default messagingWebSocketService;