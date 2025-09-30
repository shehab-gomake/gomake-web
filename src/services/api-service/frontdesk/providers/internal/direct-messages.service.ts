import { MessagingHubHttpClient } from "@/services/messaging-hub-http-client";
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
} from "@/widgets/frontdesk/providers/internal/types/direct-messages.types";

export class DirectMessagesService extends MessagingHubHttpClient {
  // Create or reopen conversation
  async createConversation(data: CreateConversationRequest): Promise<CreateConversationResponse> {
    const conversation = await this.post<Conversation>("/dms", data);

    // The backend returns the conversation directly,
    // but our interface expects it wrapped with members
    return {
      conversation,
      members: conversation.members || [],
    };
  }

  // List conversations
  async listConversations(
    options: {
      limit?: number;
      offset?: number;
      includeArchived?: boolean;
    } = {}
  ): Promise<ListConversationsResponse> {
    const params = new URLSearchParams();
    if (options.limit !== undefined) params.append("limit", options.limit.toString());
    if (options.offset !== undefined) params.append("offset", options.offset.toString());
    if (options.includeArchived !== undefined) {
      params.append("includeArchived", options.includeArchived.toString());
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const rawResponse = await this.get<any[]>(`/dms${queryString}`);
    console.log("Raw API response:", rawResponse);

    // Transform API response to match expected Conversation interface
    const conversations: Conversation[] = rawResponse.map((conv: any) => ({
      id: conv.id,
      type: conv.type,
      participantCount: conv.participantCount,
      lastMessageAt: conv.lastMessageAt,
      name: conv.name,
      isActive: conv.isActive,
      unreadCount: conv.unreadCount,
      members:
        conv.members?.map((member: any) => ({
          userId: member.userId,
          email: member.user?.email || "",
          firstName: member.user?.firstName || "",
          lastName: member.user?.lastName || "",
          name: member.user?.name || "",
          isArchived: member.isArchived,
          isFavorite: member.isFavorite,
          lastReadAt: member.lastReadAt,
          lastReadMessageId: member.lastReadMessageId,
          role: member.role === "admin" ? "admin" : "member",
        })) || [],
    }));

    console.log("Transformed conversations:", conversations);

    return {
      conversations,
      hasMore: false, // TODO: Implement pagination when backend supports it
      total: conversations.length,
    };
  }

  // Get conversation details
  async getConversation(conversationId: string): Promise<Conversation> {
    return this.get<Conversation>(`/dms/${conversationId}`);
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
    if (options.before) params.append("before", options.before);
    if (options.after) params.append("after", options.after);
    if (options.limit) params.append("limit", options.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const rawResponse = await this.get<any[]>(`/dms/${conversationId}/messages${queryString}`);

    // Transform the raw array response to match our interface
    const messages: DMMessage[] = rawResponse.map((msg: any) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      userId: msg.userId || msg.user?.id || "",
      // Prioritize user object data, then flat fields
      userEmail: msg.user?.email || msg.userEmail || "",
      userName: msg.user?.name || msg.userName || msg.user?.email || "",
      content: msg.content,
      createdAt: msg.createdAt,
      isSystem: msg.isSystem || false,
      editedAt: msg.editedAt || null,
      deletedAt: msg.deletedAt || null,
      metadata: msg.metadata || { type: "text" },
      // Preserve the complete user object if provided
      user: msg.user || undefined,
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
  async sendMessage(conversationId: string, data: SendMessageRequest): Promise<DMMessage> {
    return this.post<DMMessage>(`/dms/${conversationId}/messages`, data);
  }

  // Mark as read
  async markAsRead(conversationId: string, data: MarkAsReadRequest): Promise<void> {
    return this.post<void>(`/dms/${conversationId}/read`, data);
  }

  // Archive conversation
  async archiveConversation(conversationId: string): Promise<void> {
    return this.post<void>(`/dms/${conversationId}/archive`);
  }

  // Unarchive conversation
  async unarchiveConversation(conversationId: string): Promise<void> {
    return this.post<void>(`/dms/${conversationId}/unarchive`);
  }

  // Favorite conversation
  async favoriteConversation(conversationId: string): Promise<void> {
    return this.post<void>(`/dms/${conversationId}/favorite`);
  }

  // Unfavorite conversation
  async unfavoriteConversation(conversationId: string): Promise<void> {
    return this.post<void>(`/dms/${conversationId}/unfavorite`);
  }

  // Leave conversation (group only)
  async leaveConversation(conversationId: string): Promise<void> {
    return this.post<void>(`/dms/${conversationId}/leave`);
  }

  // Add members to conversation
  async addMembers(conversationId: string, data: AddMembersRequest): Promise<Conversation> {
    return this.post<Conversation>(`/dms/${conversationId}/add-members`, data);
  }

  // Get conversation members
  async getConversationMembers(conversationId: string): Promise<ConversationMember[]> {
    return this.get<ConversationMember[]>(`/dms/${conversationId}/members`);
  }

  // Search conversations
  async searchConversations(query: string): Promise<Conversation[]> {
    const params = new URLSearchParams();
    params.append("q", query);
    return this.get<Conversation[]>(`/dms/search?${params.toString()}`);
  }

  // Search messages globally across all conversations
  async searchAllMessages(
    query: string,
    options: {
      limit?: number;
      offset?: number;
      sortBy?: 'relevance' | 'date_desc' | 'date_asc';
      useFullText?: boolean;
      includeConversationInfo?: boolean;
    } = {}
  ): Promise<{
    results: Array<{
      id: string;
      conversationId: string;
      content: string;
      contentSnippet: string;
      createdAt: string;
      userId: string;
      isSystem: boolean;
      rank?: number;
      highlights?: Array<{ start: number; end: number; text: string }>;
      messagePosition?: {
        messageIndex: number;
        totalMessages: number;
        previousMessageId?: string;
        nextMessageId?: string;
      };
      user?: {
        name: string | null;
        firstName: string | null;
        lastName: string | null;
      };
      conversation?: {
        id: string;
        name: string | null;
        type: 'DM' | 'GROUP_DM' | 'direct' | 'group';
        participantCount: number;
      };
    }>;
    total: number;
    hasMore: boolean;
  }> {
    const params = new URLSearchParams();
    params.append("query", query);
    if (options.limit !== undefined) params.append("limit", options.limit.toString());
    if (options.offset !== undefined) params.append("offset", options.offset.toString());
    if (options.sortBy) params.append("sortBy", options.sortBy);
    if (options.useFullText !== undefined) params.append("useFullText", options.useFullText.toString());
    if (options.includeConversationInfo !== undefined) {
      params.append("includeConversationInfo", options.includeConversationInfo.toString());
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const fetchSearch = async (endpoint: string) => this.get<any>(endpoint);

    let response: any;
    try {
      response = await fetchSearch(`/dms/search${queryString}`);
    } catch (error: any) {
      const message = typeof error?.message === 'string' ? error.message : '';
      if (message.includes('404') || message.includes('Not Found')) {
        response = await fetchSearch(`/dms/search/all${queryString}`);
      } else {
        throw error;
      }
    }

    const rawResults = Array.isArray(response)
      ? response
      : Array.isArray(response?.results)
        ? response.results
        : [];

    const mappedResults = rawResults.map((result: any, index: number) => ({
      id: result.id,
      conversationId: result.conversationId ?? result.conversation?.id ?? '',
      content: result.content,
      contentSnippet: result.contentSnippet || result.content,
      createdAt: result.createdAt,
      userId: result.userId,
      isSystem: Boolean(result.isSystem),
      rank: typeof result.rank === 'number' ? result.rank : undefined,
      highlights: Array.isArray(result.highlights) ? result.highlights : undefined,
      messagePosition: result.messagePosition
        ? {
            messageIndex: result.messagePosition.messageIndex ?? index,
            totalMessages: result.messagePosition.totalMessages ?? 0,
            previousMessageId: result.messagePosition.previousMessageId,
            nextMessageId: result.messagePosition.nextMessageId,
          }
        : undefined,
      user: result.user
        ? {
            name: result.user.name ?? null,
            firstName: result.user.firstName ?? null,
            lastName: result.user.lastName ?? null,
          }
        : undefined,
      conversation: result.conversation
        ? {
            id: result.conversation.id,
            name: result.conversation.name ?? null,
            type: result.conversation.type,
            participantCount: result.conversation.participantCount ?? 0,
          }
        : undefined,
    }));

    const total = typeof response?.total === 'number' ? response.total : mappedResults.length;
    const hasMore =
      typeof response?.hasMore === 'boolean'
        ? response.hasMore
        : options.limit !== undefined
          ? mappedResults.length === options.limit
          : false;

    return {
      results: mappedResults,
      total,
      hasMore,
    };
  }

  // Search messages within a specific conversation
  async searchMessagesInConversation(
    conversationId: string,
    query: string,
    options: {
      limit?: number;
      offset?: number;
      sortBy?: 'relevance' | 'date_desc' | 'date_asc';
      useFullText?: boolean;
    } = {}
  ): Promise<{
    results: Array<{
      id: string;
      content: string;
      contentSnippet: string;
      createdAt: string;
      userId: string;
      isSystem: boolean;
      rank?: number;
      highlights?: Array<{ start: number; end: number; text: string }>;
      messagePosition?: {
        messageIndex: number;
        totalMessages: number;
        previousMessageId?: string;
        nextMessageId?: string;
      };
      index: number;
    }>;
    total: number;
    hasMore: boolean;
  }> {
    const params = new URLSearchParams();
    params.append("query", query);
    if (options.limit !== undefined) params.append("limit", options.limit.toString());
    if (options.offset !== undefined) params.append("offset", options.offset.toString());
    if (options.sortBy) params.append("sortBy", options.sortBy);
    if (options.useFullText !== undefined) params.append("useFullText", options.useFullText.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const fetchConversationSearch = async (endpoint: string) => this.get<any>(endpoint);

    let response: any;
    try {
      response = await fetchConversationSearch(`/dms/${conversationId}/search${queryString}`);
    } catch (error: any) {
      const message = typeof error?.message === 'string' ? error.message : '';
      if (message.includes('404') || message.includes('Not Found')) {
        response = await fetchConversationSearch(`/dms/${conversationId}/messages/search${queryString}`);
      } else {
        throw error;
      }
    }

    const rawResults = Array.isArray(response)
      ? response
      : Array.isArray(response?.results)
        ? response.results
        : [];

    const mappedResults = rawResults.map((result: any, index: number) => ({
      id: result.id,
      content: result.content,
      contentSnippet: result.contentSnippet || result.content,
      createdAt: result.createdAt,
      userId: result.userId,
      isSystem: Boolean(result.isSystem),
      rank: typeof result.rank === 'number' ? result.rank : undefined,
      highlights: Array.isArray(result.highlights) ? result.highlights : undefined,
      messagePosition: result.messagePosition
        ? {
            messageIndex: result.messagePosition.messageIndex ?? index,
            totalMessages: result.messagePosition.totalMessages ?? 0,
            previousMessageId: result.messagePosition.previousMessageId,
            nextMessageId: result.messagePosition.nextMessageId,
          }
        : undefined,
      index: result.index !== undefined
        ? result.index
        : result.messagePosition?.messageIndex !== undefined
          ? result.messagePosition.messageIndex
          : index,
    }));

    const total = typeof response?.total === 'number' ? response.total : mappedResults.length;
    const hasMore =
      typeof response?.hasMore === 'boolean'
        ? response.hasMore
        : options.limit !== undefined
          ? mappedResults.length === options.limit
          : false;

    return {
      results: mappedResults,
      total,
      hasMore,
    };
  }

  // Load messages around a target message for search result context
  async loadMessagesAroundTarget(
    conversationId: string,
    targetMessageId: string,
    options: {
      beforeCount?: number;
      afterCount?: number;
    } = {}
  ): Promise<{
    messagesBefore: DMMessage[];
    messagesAfter: DMMessage[];
    targetExists: boolean;
  }> {
    const { beforeCount = 25, afterCount = 10 } = options;

    try {
      // Load messages before the target
      const beforeResponse = await this.listMessages(conversationId, {
        before: targetMessageId,
        limit: beforeCount,
      });

      // Load messages after the target
      const afterResponse = await this.listMessages(conversationId, {
        after: targetMessageId,
        limit: afterCount,
      });

      // Check if target message exists in either response
      const targetExists = beforeResponse.messages.some(m => m.id === targetMessageId) ||
                          afterResponse.messages.some(m => m.id === targetMessageId);

      return {
        messagesBefore: beforeResponse.messages,
        messagesAfter: afterResponse.messages,
        targetExists,
      };
    } catch (error: any) {
      console.error('Failed to load messages around target:', error);
      return {
        messagesBefore: [],
        messagesAfter: [],
        targetExists: false,
      };
    }
  }

  // Get user suggestions for starting new conversations (maps from /api/users/search)
  async getUserSuggestions(
    query?: string,
    options: { limit?: number; onlineOnly?: boolean; department?: string; role?: string } = {}
  ): Promise<ConversationMember[]> {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (options.limit) params.append("limit", String(options.limit));
    if (options.onlineOnly !== undefined) params.append("onlineOnly", String(options.onlineOnly));
    if (options.department) params.append("department", options.department);
    if (options.role) params.append("role", options.role);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    // We don't know the exact response envelope; retrieve as unknown and map defensively
    const raw: unknown = await this.get<unknown>(`/users/search${queryString}`);

    const mapToMember = (u: any): ConversationMember => {
      const firstName = u.firstName || u.first_name || "";
      const lastName = u.lastName || u.last_name || "";
      const name = u.name || `${firstName} ${lastName}`.trim() || u.email || "User";
      const role = (u.role === "admin" ? "admin" : "member") as ConversationMember["role"];
      return {
        userId: u.userId || u.id || u._id || "",
        email: u.email || "",
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
    if (raw && typeof raw === "object") {
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
