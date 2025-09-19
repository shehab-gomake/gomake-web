import { getUserToken } from "@/services/storage-data";
import { EmailAccount, EmailListResponse, EmailSendRequest, EmailThread } from "../types/email.types";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_MESSAGING_SERVICE_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
};

const getHeaders = (): Record<string, string> => {
  const userToken = getUserToken();
  return {
    "Content-Type": "application/json",
    ...(userToken && { Authorization: `Bearer ${userToken}` }),
  };
};

class EmailApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  // Account Management
  async getAccounts(): Promise<EmailAccount[]> {
    const response = await fetch(`${this.baseUrl}/email/accounts`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch accounts: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async getAuthUrl(provider: string = "gmail"): Promise<{ url: string; state: string; provider: string }> {
    const response = await fetch(`${this.baseUrl}/email/auth/${provider === "gmail" ? "google" : provider}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get auth URL: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async disconnectAccount(accountId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/email/accounts/${accountId}/disconnect`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to disconnect account: ${response.status}`);
    }
  }

  // Messages
  async getMessages(
    accountId: string,
    params?: {
      limit?: number;
      pageToken?: string;
      query?: string;
      folder?: string;
    }
  ): Promise<EmailListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.pageToken) queryParams.append("pageToken", params.pageToken);
    if (params?.query) queryParams.append("query", params.query);
    if (params?.folder) queryParams.append("folder", params.folder);

    const url = `${this.baseUrl}/email/accounts/${accountId}/messages${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async updateMessage(
    accountId: string,
    messageId: string,
    update: { starred?: boolean; read?: boolean }
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/email/accounts/${accountId}/messages/${messageId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      throw new Error(`Failed to update message: ${response.status}`);
    }
  }

  async deleteMessage(accountId: string, messageId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/email/accounts/${accountId}/messages/${messageId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete message: ${response.status}`);
    }
  }

  async archiveMessage(accountId: string, messageId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/email/accounts/${accountId}/messages/${messageId}/archive`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to archive message: ${response.status}`);
    }
  }

  async getThread(accountId: string, threadId: string): Promise<EmailThread> {
    const response = await fetch(`${this.baseUrl}/email/accounts/${accountId}/threads/${threadId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch thread: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  // Send Email
  async sendEmail(accountId: string, email: EmailSendRequest): Promise<{ success: boolean; messageId?: string }> {
    const response = await fetch(`${this.baseUrl}/email/accounts/${accountId}/send`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  // Utility methods for retry logic
  async retryableRequest<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
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
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError || new Error("Request failed after retries");
  }
}

export const emailApiClient = new EmailApiClient();