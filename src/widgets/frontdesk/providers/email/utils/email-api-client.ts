import { MessagingHubHttpClient } from "@/services/messaging-hub-http-client";
import {
  EmailAccount,
  EmailListResponse,
  EmailSendRequest,
  EmailThread,
  ConversationListResponse,
  ConversationDetailResponse,
  EmailLabelsResponse,
} from "../types/email.types";

class EmailApiClient extends MessagingHubHttpClient {
  // Account Management
  async getAccounts(): Promise<EmailAccount[]> {
    return this.get<EmailAccount[]>("/email/accounts");
  }

  async getAuthUrl(provider: string = "gmail"): Promise<{ url: string; state: string; provider: string }> {
    // Updated to new OAuth endpoint path
    return this.get<{ url: string; state: string; provider: string }>(
      `/auth/oauth/${provider === "gmail" ? "google" : provider}`
    );
  }

  async disconnectAccount(accountId: string): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`/email/accounts/${accountId}`);
  }

  async getAccountLabels(accountId: string, params?: { limit?: number }): Promise<EmailLabelsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return this.get<EmailLabelsResponse>(`/email/accounts/${accountId}/labels${queryString}`);
  }

  // Conversations
  async getConversations(
    accountId: string,
    params?: {
      limit?: number;
      pageToken?: string;
      query?: string;
    }
  ): Promise<ConversationListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.pageToken) queryParams.append("pageToken", params.pageToken);
    if (params?.query) queryParams.append("query", params.query);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return this.get<ConversationListResponse>(`/email/accounts/${accountId}/messages${queryString}`);
  }

  // Messages
  async getMessages(
    accountId: string,
    params?: {
      limit?: number;
      pageToken?: string;
      query?: string;
    }
  ): Promise<EmailListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.pageToken) queryParams.append("pageToken", params.pageToken);
    if (params?.query) queryParams.append("query", params.query);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return this.get<EmailListResponse>(`/email/accounts/${accountId}/messages${queryString}`);
  }

  async updateMessage(accountId: string, messageId: string, update: { starred?: boolean; read?: boolean }): Promise<void> {
    return this.patch<void>(`/email/accounts/${accountId}/messages/${messageId}`, update);
  }

  async deleteMessage(accountId: string, messageId: string): Promise<void> {
    return this.delete<void>(`/email/accounts/${accountId}/messages/${messageId}`);
  }

  async archiveMessage(accountId: string, messageId: string): Promise<void> {
    return this.post<void>(`/email/accounts/${accountId}/messages/${messageId}/archive`);
  }

  async markAsRead(accountId: string, messageId: string): Promise<void> {
    return this.post<void>(`/email/accounts/${accountId}/messages/${messageId}/read`);
  }

  async markAsUnread(accountId: string, messageId: string): Promise<void> {
    return this.post<void>(`/email/accounts/${accountId}/messages/${messageId}/unread`);
  }

  async trashMessage(accountId: string, messageId: string): Promise<void> {
    return this.post<void>(`/email/accounts/${accountId}/messages/${messageId}/trash`);
  }

  async deleteMessagePermanently(accountId: string, messageId: string): Promise<void> {
    return this.delete<void>(`/email/accounts/${accountId}/messages/${messageId}`);
  }

  async downloadAttachment(accountId: string, messageId: string, attachmentId: string): Promise<Blob> {
    return this.get<Blob>(`/email/accounts/${accountId}/messages/${messageId}/attachments/${attachmentId}`);
  }

  async getThread(accountId: string, threadId: string): Promise<EmailThread> {
    return this.get<EmailThread>(`/email/accounts/${accountId}/threads/${threadId}`);
  }

  async getConversationDetail(accountId: string, conversationId: string): Promise<ConversationDetailResponse> {
    return this.get<ConversationDetailResponse>(`/email/accounts/${accountId}/conversations/${conversationId}`);
  }

  // Send Email
  async sendEmail(accountId: string, email: EmailSendRequest): Promise<{ success: boolean; messageId?: string }> {
    return this.post<{ success: boolean; messageId?: string }>(`/email/accounts/${accountId}/send`, email);
  }

  // Utility methods for retry logic
  async retryableRequest<T>(fn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on 4xx errors (except 429)
        if (error instanceof Error && error.message.includes("4") && !error.message.includes("429")) {
          throw error;
        }

        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError || new Error("Request failed after retries");
  }
}

export const emailApiClient = new EmailApiClient();
