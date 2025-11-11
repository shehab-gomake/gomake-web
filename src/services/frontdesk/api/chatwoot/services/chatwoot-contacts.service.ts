/**
 * Chatwoot Contacts Service
 *
 * Handles all contact-related endpoints.
 * All endpoints require account_id.
 *
 * @see ContactsApi.md
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import type {
  ContactDetail,
  ContactCreatePayload,
  ContactUpdatePayload,
  ContactsListResponse,
  ContactFilterRequest,
  ContactConversationsResponse,
} from "../types/contacts.types";

/**
 * ChatwootContactsService
 * Handles contact-related API operations
 * 
 * @example
 * ```typescript
 * const contactsService = new ChatwootContactsService();
 * 
 * // List contacts
 * const contacts = await contactsService.listContacts(accountId, { page: 1 });
 * 
 * // Get contact details
 * const contact = await contactsService.getContactDetails(accountId, contactId);
 * ```
 */
export class ChatwootContactsService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }
  /**
   * List Contacts
   * GET /api/v1/accounts/{account_id}/contacts
   *
   * @param accountId - The numeric ID of the account
   * @param params - Query parameters (page, search, etc.)
   * @returns Promise with contact list
   */
  async listContacts(
    accountId: number,
    params?: {
      page?: number;
      sort?: string;
      [key: string]: unknown;
    }
  ): Promise<ContactsListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const url = this.accountScopedUrl(
      accountId,
      `contacts${queryString ? `?${queryString}` : ""}`
    );
    return await this.get<ContactsListResponse>(url);
  }

  /**
   * Get Contact Details
   * GET /api/v1/accounts/{account_id}/contacts/{id}
   *
   * @param accountId - The numeric ID of the account
   * @param contactId - The numeric ID of the contact
   * @returns Promise with contact details
   */
  async getContactDetails(
    accountId: number,
    contactId: number
  ): Promise<ContactDetail> {
    return await this.get<ContactDetail>(
      this.accountScopedUrl(accountId, `contacts/${contactId}`)
    );
  }

  /**
   * Create Contact
   * POST /api/v1/accounts/{account_id}/contacts
   *
   * @param accountId - The numeric ID of the account
   * @param payload - Contact creation payload
   * @returns Promise with created contact
   */
  async createContact(accountId: number, payload: ContactCreatePayload): Promise<ContactDetail> {
    return await this.post<ContactDetail>(
      this.accountScopedUrl(accountId, "contacts"),
      payload
    );
  }

  /**
   * Update Contact
   * PUT /api/accounts/contacts/{id}
   *
   * Note: Backend automatically handles accountId from authentication context.
   * This endpoint uses /api instead of /api/v1 and doesn't require accountId in path.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for API consistency)
   * @param contactId - The numeric ID of the contact
   * @param payload - Update payload
   * @returns Promise with updated contact
   */
  async updateContact(
    accountId: number,
    contactId: number,
    payload: ContactUpdatePayload
  ): Promise<ContactDetail> {
    // Backend handles accountId via JWT authentication
    return await this.put<ContactDetail>(
      `/api/accounts/contacts/${contactId}`,
      payload
    );
  }

  /**
   * Delete Contact
   * DELETE /api/v1/accounts/{account_id}/contacts/{id}
   * 
   * @param accountId - The numeric ID of the account
   * @param contactId - The numeric ID of the contact
   * @returns Promise<void>
   */
  async deleteContact(accountId: number, contactId: number): Promise<void> {
    return await this.delete<void>(
      this.accountScopedUrl(accountId, `contacts/${contactId}`)
    );
  }

  /**
   * Search Contacts
   * GET /api/v1/accounts/{account_id}/contacts/search
   *
   * @param accountId - The numeric ID of the account
   * @param query - Search query string
   * @returns Promise with search results
   */
  async searchContacts(accountId: number, query: string): Promise<ContactsListResponse> {
    const url = this.accountScopedUrl(
      accountId,
      `contacts/search?q=${encodeURIComponent(query)}`
    );
    return await this.get<ContactsListResponse>(url);
  }

  /**
   * Filter Contacts
   * POST /api/accounts/contacts/filter
   *
   * Note: Backend automatically handles accountId from authentication context.
   * This endpoint uses /api instead of /api/v1 and doesn't require accountId in path.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for API consistency)
   * @param filterPayload - Filter criteria
   * @param params - Optional query parameters (include_contact_inboxes, page, sort)
   * @returns Promise with filtered contacts
   */
  async filterContacts(
    accountId: number,
    filterPayload: ContactFilterRequest,
    params?: {
      include_contact_inboxes?: boolean;
      page?: number;
      sort?: string;
    }
  ): Promise<ContactsListResponse> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    // This endpoint doesn't include accountId in path - proxy handles it via JWT
    const url = `/api/accounts/contacts/filter${queryString ? `?${queryString}` : ""}`;
    return await this.post<ContactsListResponse>(url, filterPayload);
  }

  /**
   * Get Contact Conversations
   * GET /api/accounts/contacts/{contact_id}/conversations
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for API consistency)
   * @param contactId - The numeric ID of the contact
   * @returns Promise with contact conversations
   */
  async getContactConversations(
    accountId: number,
    contactId: number
  ): Promise<ContactConversationsResponse> {
    // This endpoint doesn't include accountId in path - proxy handles it via JWT
    return await this.get<ContactConversationsResponse>(
      `/api/accounts/contacts/${contactId}/conversations`
    );
  }

  /**
   * Get Contactable Inboxes
   * GET /api/accounts/contacts/{id}/contactable_inboxes
   *
   * Gets the list of inboxes where this contact can be reached.
   * Returns inbox details along with the source_id (email, phone, etc.)
   *
   * Note: Backend automatically handles accountId from authentication context.
   * This endpoint uses /api instead of /api/v1
   *
   * @param contactId - The numeric ID of the contact
   * @returns Promise with contactable inboxes
   *
   * @example
   * ```typescript
   * const inboxes = await contactsService.getContactableInboxes(123);
   * // Returns: [{ source_id: "user@example.com", inbox: {...} }]
   * ```
   */
  async getContactableInboxes(
    contactId: number
  ): Promise<import("../types/inboxes.types").ContactableInboxesResponse> {
    return await this.get<import("../types/inboxes.types").ContactableInboxesResponse>(
      `/api/accounts/contacts/${contactId}/contactable_inboxes`
    );
  }
}

