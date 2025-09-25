import React from 'react';
import { 
  IProvider, 
  ProviderCapabilities, 
  Account, 
  Conversation, 
  Message 
} from './provider.interface';

/**
 * Abstract base class for all providers
 * Provides common functionality and enforces interface implementation
 */
export abstract class BaseProvider implements IProvider {
  // Abstract properties that must be defined by subclasses
  abstract readonly providerId: string;
  abstract readonly providerName: string;
  abstract readonly providerIcon: React.ReactNode;
  abstract readonly capabilities: ProviderCapabilities;
  
  // Common state properties with default values
  isConnected: boolean = false;
  isConnecting: boolean = false;
  connectionError?: string;
  
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  conversationsLoading: boolean = false;
  conversationsError?: string;
  
  messages: Message[] = [];
  messagesLoading: boolean = false;
  messagesError?: string;
  hasMoreMessages: boolean = false;
  
  totalUnreadCount: number = 0;
  
  // Event handlers (optional)
  onNewMessage?: (message: Message) => void;
  onMessageUpdate?: (message: Message) => void;
  onMessageDelete?: (messageId: string) => void;
  onConversationUpdate?: (conversation: Conversation) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onTyping?: (conversationId: string, userId: string, isTyping: boolean) => void;
  onPresenceUpdate?: (userId: string, status: 'online' | 'offline' | 'away') => void;
  
  // Abstract methods that must be implemented by subclasses
  abstract connect(account?: Account): Promise<void>;
  abstract disconnect(accountId?: string): Promise<void>;
  abstract fetchConversations(accountId?: string): Promise<Conversation[]>;
  abstract fetchMessages(conversationId: string, before?: string): Promise<Message[]>;
  abstract sendMessage(conversationId: string, content: string, attachments?: File[]): Promise<void>;
  
  // Common methods with default implementations
  async addAccount(): Promise<void> {
    if (!this.capabilities.multiAccount) {
      throw new Error(`${this.providerName} does not support multiple accounts`);
    }
    // Subclasses should override this for actual implementation
    throw new Error('addAccount not implemented');
  }
  
  async removeAccount(accountId: string): Promise<void> {
    if (!this.capabilities.multiAccount) {
      throw new Error(`${this.providerName} does not support multiple accounts`);
    }
    
    this.accounts = this.accounts.filter(acc => acc.id !== accountId);
    if (this.selectedAccount?.id === accountId) {
      this.selectedAccount = this.accounts[0] || null;
    }
  }
  
  selectAccount(accountId: string): void {
    const account = this.accounts.find(acc => acc.id === accountId);
    if (account) {
      this.selectedAccount = account;
      // Trigger conversation refresh for new account
      this.fetchConversations(accountId);
    }
  }
  
  selectConversation(conversationId: string): void {
    const conversation = this.conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      this.selectedConversation = conversation;
      // Trigger message fetch for selected conversation
      this.fetchMessages(conversationId);
    }
  }
  
  async markAsRead(conversationId: string): Promise<void> {
    const conversation = this.conversations.find(conv => conv.id === conversationId);
    if (conversation && conversation.unreadCount) {
      const previousCount = conversation.unreadCount;
      conversation.unreadCount = 0;
      this.totalUnreadCount = Math.max(0, this.totalUnreadCount - previousCount);
      
      // Trigger update event
      if (this.onConversationUpdate) {
        this.onConversationUpdate(conversation);
      }
    }
  }
  
  async archiveConversation(conversationId: string): Promise<void> {
    if (!this.capabilities.archive) {
      throw new Error(`${this.providerName} does not support archiving`);
    }
    // Subclasses should override for actual implementation
    this.conversations = this.conversations.filter(conv => conv.id !== conversationId);
  }
  
  async deleteConversation(conversationId: string): Promise<void> {
    this.conversations = this.conversations.filter(conv => conv.id !== conversationId);
    if (this.selectedConversation?.id === conversationId) {
      this.selectedConversation = null;
      this.messages = [];
    }
  }
  
  async editMessage(messageId: string, newContent: string): Promise<void> {
    const message = this.messages.find(msg => msg.messageId === messageId);
    if (message) {
      message.content = newContent;
      // Add edited timestamp/flag
      if (!message.metadata) message.metadata = { type: 'text' };
      message.metadata.edited = true;
      message.metadata.editedAt = new Date().toISOString();
      
      // Trigger update event
      if (this.onMessageUpdate) {
        this.onMessageUpdate(message);
      }
    }
  }
  
  async deleteMessage(messageId: string): Promise<void> {
    this.messages = this.messages.filter(msg => msg.messageId !== messageId);
    
    // Trigger delete event
    if (this.onMessageDelete) {
      this.onMessageDelete(messageId);
    }
  }
  
  async searchConversations(query: string): Promise<Conversation[]> {
    if (!this.capabilities.search) {
      // Fallback to client-side search
      const lowerQuery = query.toLowerCase();
      return this.conversations.filter(conv => 
        conv.name.toLowerCase().includes(lowerQuery) ||
        conv.lastMessage?.toLowerCase().includes(lowerQuery)
      );
    }
    // Subclasses should override for server-side search
    throw new Error('searchConversations not implemented');
  }
  
  async searchMessages(query: string, conversationId?: string): Promise<Message[]> {
    if (!this.capabilities.search) {
      // Fallback to client-side search
      const lowerQuery = query.toLowerCase();
      const messages = conversationId 
        ? this.messages.filter(msg => msg.channelId === conversationId)
        : this.messages;
      
      return messages.filter(msg => 
        msg.content.toLowerCase().includes(lowerQuery)
      );
    }
    // Subclasses should override for server-side search
    throw new Error('searchMessages not implemented');
  }
  
  async refresh(): Promise<void> {
    // Refresh all accounts or selected account
    const accountIds = this.capabilities.multiAccount && this.selectedAccount
      ? [this.selectedAccount.id]
      : this.accounts.map(acc => acc.id);
    
    for (const accountId of accountIds) {
      await this.syncAccount(accountId);
    }
  }
  
  async syncAccount(accountId: string): Promise<void> {
    try {
      // Fetch fresh conversations
      await this.fetchConversations(accountId);
      
      // Update last synced timestamp
      const account = this.accounts.find(acc => acc.id === accountId);
      if (account) {
        account.lastSyncedAt = new Date().toISOString();
      }
    } catch (error) {
      // Failed to sync account - error should be handled by caller
      throw error;
    }
  }
  
  // Helper methods
  protected updateConnectionState(isConnected: boolean, error?: string): void {
    this.isConnected = isConnected;
    this.isConnecting = false;
    this.connectionError = error;
    
    if (this.onConnectionChange) {
      this.onConnectionChange(isConnected);
    }
  }
  
  protected calculateTotalUnread(): void {
    this.totalUnreadCount = this.conversations.reduce(
      (sum, conv) => sum + (conv.unreadCount || 0), 
      0
    );
  }
  
  protected sortConversationsByRecent(): void {
    this.conversations.sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });
  }
  
  protected sortMessagesByTime(): void {
    this.messages.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return aTime - bTime;
    });
  }
}