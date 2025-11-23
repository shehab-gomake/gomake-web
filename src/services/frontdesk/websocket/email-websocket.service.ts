
import { Socket } from 'socket.io-client';
import { messagingService } from './messaging-socket.service';
import type { EmailConversation } from '@/widgets/frontdesk/providers/email/types/email.types';

const EMAIL_EVENTS = {
  NEW_EMAIL: 'email:new',
  EMAIL_UPDATED: 'email:updated',
  EMAIL_READ: 'email:read',
  EMAIL_DELETED: 'email:deleted',
};

export interface EmailSocketEvent {
  type: 'NEW_EMAIL' | 'EMAIL_UPDATED' | 'EMAIL_READ' | 'EMAIL_DELETED';
  data: EmailConversation;
  accountId: string;
}

class EmailWebSocketService {
  private socket: Socket | null = null;
  private handlers: Map<string, Set<(event: EmailSocketEvent) => void>> = new Map();

  public initialize(): void {
    this.socket = messagingService.getSocket();
    if (!this.socket) {
      console.error('[EmailWebSocketService] Socket not available');
      return;
    }

    // Set up event listeners
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // New email received
    this.socket.on(EMAIL_EVENTS.NEW_EMAIL, (data: any) => {
      console.log('[EmailWebSocketService] New email received:', data);
      this.notifyHandlers({
        type: 'NEW_EMAIL',
        data: data.conversation || data,
        accountId: data.accountId,
      });
    });

    // Email updated (read/unread, starred, etc.)
    this.socket.on(EMAIL_EVENTS.EMAIL_UPDATED, (data: any) => {
      console.log('[EmailWebSocketService] Email updated:', data);
      this.notifyHandlers({
        type: 'EMAIL_UPDATED',
        data: data.conversation || data,
        accountId: data.accountId,
      });
    });

    // Email marked as read
    this.socket.on(EMAIL_EVENTS.EMAIL_READ, (data: any) => {
      console.log('[EmailWebSocketService] Email read:', data);
      this.notifyHandlers({
        type: 'EMAIL_READ',
        data: data.conversation || data,
        accountId: data.accountId,
      });
    });

    // Email deleted
    this.socket.on(EMAIL_EVENTS.EMAIL_DELETED, (data: any) => {
      console.log('[EmailWebSocketService] Email deleted:', data);
      this.notifyHandlers({
        type: 'EMAIL_DELETED',
        data: data.conversation || data,
        accountId: data.accountId,
      });
    });
  }

  private notifyHandlers(event: EmailSocketEvent): void {
    this.handlers.forEach((handlerSet) => {
      handlerSet.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error('[EmailWebSocketService] Handler error:', error);
        }
      });
    });
  }

  /**
   * Subscribe to email events
   * @param handler Callback function to handle email events
   * @returns Unsubscribe function
   */
  public subscribe(handler: (event: EmailSocketEvent) => void): () => void {
    const handlerId = `handler_${Date.now()}_${Math.random()}`;

    if (!this.handlers.has(handlerId)) {
      this.handlers.set(handlerId, new Set());
    }

    this.handlers.get(handlerId)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlerSet = this.handlers.get(handlerId);
      if (handlerSet) {
        handlerSet.delete(handler);
        if (handlerSet.size === 0) {
          this.handlers.delete(handlerId);
        }
      }
    };
  }

  /**
   * Legacy methods for backward compatibility
   * @deprecated Use subscribe() instead
   */
  public onNewEmail(handler: (email: any) => void): void {
    if (!this.socket) return;
    this.socket.on(EMAIL_EVENTS.NEW_EMAIL, handler);
  }

  /**
   * @deprecated Use subscribe() instead
   */
  public onEmailUpdated(handler: (email: any) => void): void {
    if (!this.socket) return;
    this.socket.on(EMAIL_EVENTS.EMAIL_UPDATED, handler);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.off(EMAIL_EVENTS.NEW_EMAIL);
      this.socket.off(EMAIL_EVENTS.EMAIL_UPDATED);
      this.socket.off(EMAIL_EVENTS.EMAIL_READ);
      this.socket.off(EMAIL_EVENTS.EMAIL_DELETED);
    }
    this.handlers.clear();
  }

  public isInitialized(): boolean {
    return this.socket !== null;
  }
}

export const emailWebSocketService = new EmailWebSocketService();
