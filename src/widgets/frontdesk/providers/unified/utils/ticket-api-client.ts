import { getUserToken } from "@/services/storage-data";
import config from "@/config";

const getBaseUrl = () => {
  const url = config.messaging_server || config.api_server;
  return url.replace(/\/$/, "");
};

const getHeaders = (): Record<string, string> => {
  const userToken = getUserToken();
  return {
    "Content-Type": "application/json",
    ...(userToken && { Authorization: `Bearer ${userToken}` }),
  };
};

class TicketApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: getHeaders(),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      if (data.success !== undefined) {
        return data;
      } else {
        return { success: true, data };
      }
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Ticket operations
  async assignTicket(ticketId: string, assigneeId: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/assign`, {
      method: 'POST',
      body: JSON.stringify({ assigneeId }),
    });
  }

  async updateTicketStatus(ticketId: string, status: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateTicketPriority(ticketId: string, priority: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    });
  }

  async replyToTicket(ticketId: string, content: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async addTicketNote(ticketId: string, note: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  }

  async addTicketTag(ticketId: string, tag: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag }),
    });
  }

  async removeTicketTag(ticketId: string, tag: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/tags/${encodeURIComponent(tag)}`, {
      method: 'DELETE',
    });
  }

  async mergeTickets(sourceTicketId: string, targetTicketId: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(sourceTicketId)}/merge`, {
      method: 'POST',
      body: JSON.stringify({ targetTicketId }),
    });
  }

  async reopenTicket(ticketId: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/reopen`, {
      method: 'POST',
    });
  }

  async getAvailableAgents() {
    return this.makeRequest('/api/tickets/agents', {
      method: 'GET',
    });
  }

  async getTicketCategories() {
    return this.makeRequest('/api/tickets/categories', {
      method: 'GET',
    });
  }

  async getTicketHistory(ticketId: string) {
    return this.makeRequest(`/api/tickets/${encodeURIComponent(ticketId)}/history`, {
      method: 'GET',
    });
  }
}

export const ticketApiClient = new TicketApiClient();