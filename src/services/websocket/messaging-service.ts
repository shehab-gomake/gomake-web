import { io, Socket } from 'socket.io-client';
import config from '@/config';
import { getUserToken } from '@/services/storage-data';
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
  TypingIndicator
} from '@/widgets/frontdesk/providers/internal/types';

export type MessageEventHandler = (message: Message) => void;
export type PresenceEventHandler = (data: any) => void;
export type TypingEventHandler = (data: TypingIndicator) => void;
export type ConnectionEventHandler = (connected: boolean) => void;
export type ErrorEventHandler = (error: string) => void;

export class MessagingService {
  private socket: Socket | null = null;
  private serverUrl: string;
  private isConnecting: boolean = false;

  constructor() {
    this.serverUrl = config.messaging_server || config.api_server;
  }

  connect(authToken?: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      const token = authToken || getUserToken();
      console.log('Messaging Service - Auth Token:', token ? 'Present' : 'Missing');
      if (!token) {
        this.isConnecting = false;
        console.error('Messaging Service - No authentication token available');
        reject(new Error('No authentication token available'));
        return;
      }

      console.log('Messaging Service - Connecting to:', `${this.serverUrl}/messaging`);
      this.socket = io(`${this.serverUrl}/messaging`, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10
      });

      this.socket.on('connect', () => {
        console.log('Connected to messaging service');
        this.isConnecting = false;
        resolve(this.socket!);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from messaging service. Reason:', reason);
        console.log('Disconnect details:', { reason, connected: this.socket?.connected });
        this.isConnecting = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);
        console.error('Error details:', error);
        this.isConnecting = false;
        reject(error);
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      this.socket.on('exception', (error) => {
        console.error('Socket exception:', error);
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
  sendMessage(data: SendMessageData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('sendMessage', data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to send message'));
        }
      });
    });
  }

  // Channel operations
  joinChannel(data: JoinChannelData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('joinChannel', data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to join channel'));
        }
      });
    });
  }

  leaveChannel(data: JoinChannelData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('leaveChannel', data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to leave channel'));
        }
      });
    });
  }

  // Typing indicators
  startTyping(data: TypingData): void {
    if (this.socket?.connected) {
      this.socket.emit('typingStart', data);
    }
  }

  stopTyping(data: TypingData): void {
    if (this.socket?.connected) {
      this.socket.emit('typingStop', data);
    }
  }

  // Read receipts
  markAsRead(data: MarkAsReadData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('markAsRead', data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to mark as read'));
        }
      });
    });
  }

  // Presence operations
  updateStatus(data: UpdateStatusData): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('updateStatus', data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to update status'));
        }
      });
    });
  }

  getPresence(data: GetPresenceData = {}): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('getPresence', data, (response: SocketResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to get presence'));
        }
      });
    });
  }

  // Event listeners
  onNewMessage(handler: MessageEventHandler): void {
    if (this.socket) {
      this.socket.on('newMessage', handler);
    }
  }

  onDirectMessage(handler: MessageEventHandler): void {
    if (this.socket) {
      this.socket.on('directMessage', handler);
    }
  }

  onUserOnline(handler: PresenceEventHandler): void {
    if (this.socket) {
      this.socket.on('userOnline', handler);
    }
  }

  onUserOffline(handler: PresenceEventHandler): void {
    if (this.socket) {
      this.socket.on('userOffline', handler);
    }
  }

  onUserTyping(handler: TypingEventHandler): void {
    if (this.socket) {
      this.socket.on('userTyping', handler);
    }
  }

  onStatusChanged(handler: PresenceEventHandler): void {
    if (this.socket) {
      this.socket.on('statusChanged', handler);
    }
  }

  onMessageRead(handler: (data: { messageId: string; readBy: string; readAt: string }) => void): void {
    if (this.socket) {
      this.socket.on('messageRead', handler);
    }
  }

  onConnect(handler: ConnectionEventHandler): void {
    if (this.socket) {
      this.socket.on('connect', () => handler(true));
    }
  }

  onDisconnect(handler: ConnectionEventHandler): void {
    if (this.socket) {
      this.socket.on('disconnect', () => handler(false));
    }
  }

  onError(handler: ErrorEventHandler): void {
    if (this.socket) {
      this.socket.on('connect_error', (error: Error) => handler(error.message));
      this.socket.on('exception', (error: any) => handler(error.message || 'Socket exception'));
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
export const messagingService = new MessagingService();