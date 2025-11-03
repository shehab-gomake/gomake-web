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
   * PUT /api/v1/accounts/{account_id}/contacts/{id}
   *
   * @param accountId - The numeric ID of the account
   * @param contactId - The numeric ID of the contact
   * @param payload - Update payload
   * @returns Promise with updated contact
   */
  async updateContact(
    accountId: number,
    contactId: number,
    payload: ContactUpdatePayload
  ): Promise<ContactDetail> {
    return await this.put<ContactDetail>(
      this.accountScopedUrl(accountId, `contacts/${contactId}`),
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
   * POST /api/v1/accounts/{account_id}/contacts/filter
   *
   * @param accountId - The numeric ID of the account
   * @param filterPayload - Filter criteria
   * @returns Promise with filtered contacts
   */
  async filterContacts(accountId: number, filterPayload: ContactFilterRequest): Promise<ContactsListResponse> {
    return await this.post<ContactsListResponse>(
      this.accountScopedUrl(accountId, "contacts/filter"),
      filterPayload
    );
  }

  /**
   * Get Contact Conversations
   * GET /api/v1/accounts/{account_id}/contacts/{id}/conversations
   *
   * @param accountId - The numeric ID of the account
   * @param contactId - The numeric ID of the contact
   * @returns Promise with contact conversations
   */
  async getContactConversations(
    accountId: number,
    contactId: number
  ): Promise<ContactConversationsResponse> {
    return await this.get<ContactConversationsResponse>(
      this.accountScopedUrl(accountId, `contacts/${contactId}/conversations`)
    );
  }
}

