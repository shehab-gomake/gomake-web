import config from '@/config';
import { getUserToken } from '@/services/storage-data';
import {
  Conversation,
  ConversationMember,
  DMMessage,
  CreateConversationRequest,
  CreateConversationResponse,
  ListConversationsResponse,
  ListMessagesResponse,
  SendMessageRequest,
  MarkAsReadRequest,
  AddMembersRequest,
} from '@/widgets/frontdesk/providers/internal/types/direct-messages.types';

export class DirectMessagesService {
  private baseUrl: string;

  constructor() {
    // Route DM REST to the same host as the WebSocket gateway
    // so it hits the Messaging-Hub service (e.g., http://localhost:3000)
    this.baseUrl = config.messaging_server || config.api_server;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Create or reopen conversation
  async createConversation(data: CreateConversationRequest): Promise<CreateConversationResponse> {
    const conversation = await this.makeRequest<Conversation>('/dms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // The backend returns the conversation directly, 
    // but our interface expects it wrapped with members
    return {
      conversation,
      members: conversation.members || []
    };
  }

  // List conversations
  async listConversations(options: {
    limit?: number;
    offset?: number;
    includeArchived?: boolean;
  } = {}): Promise<ListConversationsResponse> {
    const params = new URLSearchParams();
    if (options.limit !== undefined) params.append('limit', options.limit.toString());
    if (options.offset !== undefined) params.append('offset', options.offset.toString());
    if (options.includeArchived !== undefined) {
      params.append('includeArchived', options.includeArchived.toString());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const rawResponse = await this.makeRequest<any[]>(`/dms${queryString}`);
    console.log('Raw API response:', rawResponse);
    
    // Transform API response to match expected Conversation interface
    const conversations: Conversation[] = rawResponse.map((conv: any) => ({
      id: conv.id,
      type: conv.type,
      participantCount: conv.participantCount,
      lastMessageAt: conv.lastMessageAt,
      name: conv.name,
      isActive: conv.isActive,
      unreadCount: conv.unreadCount,
      members: conv.members?.map((member: any) => ({
        userId: member.userId,
        email: member.user?.email || '',
        firstName: member.user?.firstName || '',
        lastName: member.user?.lastName || '',
        name: member.user?.name || '',
        isArchived: member.isArchived,
        isFavorite: member.isFavorite,
        lastReadAt: member.lastReadAt,
        lastReadMessageId: member.lastReadMessageId,
        role: member.role === 'admin' ? 'admin' : 'member',
      })) || [],
    }));
    
    console.log('Transformed conversations:', conversations);
    
    return {
      conversations,
      hasMore: false, // TODO: Implement pagination when backend supports it
      total: conversations.length,
    };
  }

  // Get conversation details
  async getConversation(conversationId: string): Promise<Conversation> {
    return this.makeRequest<Conversation>(`/dms/${conversationId}`);
  }

  // List messages (paginated)
  async listMessages(
    conversationId: string,
    options: {
      before?: string;
      after?: string;
      limit?: number;
    } = {}
  ): Promise<ListMessagesResponse> {
    const params = new URLSearchParams();
    if (options.before) params.append('before', options.before);
    if (options.after) params.append('after', options.after);
    if (options.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const rawResponse = await this.makeRequest<any[]>(`/dms/${conversationId}/messages${queryString}`);
    
    // Transform the raw array response to match our interface
    const messages: DMMessage[] = rawResponse.map((msg: any) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      userId: msg.userId,
      userEmail: msg.userEmail || msg.user?.email || '', // Preserve if exists, will be enriched from user presence
      userName: msg.userName || msg.user?.name || '', // Preserve if exists, will be enriched from user presence
      content: msg.content,
      createdAt: msg.createdAt,
      isSystem: msg.isSystem || false,
      editedAt: msg.editedAt || null,
      deletedAt: msg.deletedAt || null,
      metadata: msg.metadata || { type: 'text' },
    }));
    
    // Determine if there are more messages
    // If we got the requested limit, there might be more
    const hasMore = messages.length === (options.limit || 50);
    
    return {
      messages,
      hasMore,
      total: messages.length,
    };
  }

  // Send message (REST)
  async sendMessage(
    conversationId: string,
    data: SendMessageRequest
  ): Promise<DMMessage> {
    return this.makeRequest<DMMessage>(`/dms/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Mark as read
  async markAsRead(
    conversationId: string,
    data: MarkAsReadRequest
  ): Promise<void> {
    return this.makeRequest<void>(`/dms/${conversationId}/read`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Archive conversation
  async archiveConversation(conversationId: string): Promise<void> {
    return this.makeRequest<void>(`/dms/${conversationId}/archive`, {
      method: 'POST',
    });
  }

  // Unarchive conversation
  async unarchiveConversation(conversationId: string): Promise<void> {
    return this.makeRequest<void>(`/dms/${conversationId}/unarchive`, {
      method: 'POST',
    });
  }

  // Favorite conversation
  async favoriteConversation(conversationId: string): Promise<void> {
    return this.makeRequest<void>(`/dms/${conversationId}/favorite`, {
      method: 'POST',
    });
  }

  // Unfavorite conversation
  async unfavoriteConversation(conversationId: string): Promise<void> {
    return this.makeRequest<void>(`/dms/${conversationId}/unfavorite`, {
      method: 'POST',
    });
  }

  // Leave conversation (group only)
  async leaveConversation(conversationId: string): Promise<void> {
    return this.makeRequest<void>(`/dms/${conversationId}/leave`, {
      method: 'POST',
    });
  }

  // Add members to conversation
  async addMembers(
    conversationId: string,
    data: AddMembersRequest
  ): Promise<Conversation> {
    return this.makeRequest<Conversation>(`/dms/${conversationId}/add-members`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get conversation members
  async getConversationMembers(conversationId: string): Promise<ConversationMember[]> {
    return this.makeRequest<ConversationMember[]>(`/dms/${conversationId}/members`);
  }

  // Search conversations
  async searchConversations(query: string): Promise<Conversation[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    return this.makeRequest<Conversation[]>(`/api/dms/search?${params.toString()}`);
  }

  // Get user suggestions for starting new conversations (maps from /api/users/search)
  async getUserSuggestions(
    query?: string,
    options: { limit?: number; onlineOnly?: boolean; department?: string; role?: string } = {}
  ): Promise<ConversationMember[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (options.limit) params.append('limit', String(options.limit));
    if (options.onlineOnly !== undefined) params.append('onlineOnly', String(options.onlineOnly));
    if (options.department) params.append('department', options.department);
    if (options.role) params.append('role', options.role);

    const queryString = params.toString() ? `?${params.toString()}` : '';

    // We don't know the exact response envelope; retrieve as unknown and map defensively
    const raw: unknown = await this.makeRequest<unknown>(`/users/search${queryString}`);

    const mapToMember = (u: any): ConversationMember => {
      const firstName = u.firstName || u.first_name || '';
      const lastName = u.lastName || u.last_name || '';
      const name = u.name || `${firstName} ${lastName}`.trim() || u.email || 'User';
      const role = (u.role === 'admin' ? 'admin' : 'member') as ConversationMember['role'];
      return {
        userId: u.userId || u.id || u._id || '',
        email: u.email || '',
        firstName,
        lastName,
        name,
        isArchived: false,
        isFavorite: false,
        role,
        lastReadAt: undefined,
        lastReadMessageId: undefined,
      } as ConversationMember;
    };

    // Try common envelopes: array, {users:[]}, {results:[]}, {data:[]}
    if (Array.isArray(raw)) {
      return raw.map(mapToMember);
    }
    if (raw && typeof raw === 'object') {
      const anyRaw: any = raw;
      const collection = anyRaw.users || anyRaw.results || anyRaw.data || [];
      if (Array.isArray(collection)) {
        return collection.map(mapToMember);
      }
    }

    return [];
  }
}

// Singleton instance
export const directMessagesService = new DirectMessagesService();