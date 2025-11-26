/**
 * Chatwoot Inbox Resolution Service
 *
 * Handles inbox fetching, filtering, and sender option building.
 * Consolidates shared logic used by both FrontDesk Chatwoot and Quote Page modals.
 *
 * Key Features:
 * - Fetch contactable inboxes for a contact
 * - Filter inboxes by channel type
 * - Build sender options for UI dropdowns
 * - Map inbox IDs to source IDs for API calls
 */

import { chatwootService } from "@/services/frontdesk";
import type { ContactableInbox, ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

/**
 * Email Sender Option
 * Represents a sender option in email dropdowns
 */
export interface EmailSenderOption {
  inboxId: number;
  inboxName: string;
  sourceId: string; // Display email (inbox's email)
  channelType?: string;
}

/**
 * Inbox Source ID Map
 * Maps inbox ID to contact's source_id (email) for API calls
 */
export type InboxSourceIdMap = Map<number, string>;

/**
 * Inbox Resolution Service
 *
 * Provides reusable methods for inbox fetching, filtering, and sender option building.
 */
export class InboxResolutionService {
  /**
   * Fetch contactable inboxes for a contact
   *
   * @param contactId - Chatwoot contact ID
   * @returns Array of contactable inboxes
   */
  async getContactableInboxes(contactId: number): Promise<ContactableInbox[]> {
    try {
      const response = await chatwootService.contacts.getContactableInboxes(contactId);
      const contactableInboxes = response.payload || [];

      console.log(`[InboxResolutionService] Found ${contactableInboxes.length} contactable inbox(es) for contact ${contactId}`);
      return contactableInboxes;
    } catch (error) {
      console.error(`[InboxResolutionService] Failed to fetch contactable inboxes for contact ${contactId}:`, error);
      return [];
    }
  }

  /**
   * Filter contactable inboxes by channel type
   *
   * @param contactableInboxes - Array of contactable inboxes
   * @param channelType - Channel type to filter by (e.g., "Channel::Email", "email", "Channel::WhatsApp")
   * @returns Filtered array of contactable inboxes
   */
  filterByChannelType(
    contactableInboxes: ContactableInbox[],
    channelType?: string | ChannelType
  ): ContactableInbox[] {
    if (!channelType) {
      return contactableInboxes;
    }

    // Normalize channel type (handle both "email" and "Channel::Email" formats)
    const normalizedChannelType = channelType.includes("::")
      ? channelType
      : `Channel::${channelType.charAt(0).toUpperCase() + channelType.slice(1).toLowerCase()}`;

    return contactableInboxes.filter((item) => {
      return item.inbox?.channel_type === normalizedChannelType || item.inbox?.channel_type === channelType;
    });
  }

  /**
   * Build sender options from contactable inboxes
   * Maps contactable inboxes to sender options for UI dropdowns
   *
   * @param contactableInboxes - Array of contactable inboxes
   * @param channelType - Optional channel type to filter by
   * @returns Object containing sender options and source ID map
   */
  buildSenderOptions(
    contactableInboxes: ContactableInbox[],
    channelType?: string | ChannelType
  ): {
    senderOptions: EmailSenderOption[];
    sourceIdMap: InboxSourceIdMap;
  } {
    // Filter by channel type if provided
    const filteredInboxes = channelType
      ? this.filterByChannelType(contactableInboxes, channelType)
      : contactableInboxes;

    // Build source ID map (inbox ID -> contact's source_id for API calls)
    const sourceIdMap = new Map<number, string>();

    // Transform contactable inboxes to sender options
    const senderOptions: EmailSenderOption[] = filteredInboxes.map((contactableInbox) => {
      const inbox = contactableInbox.inbox;

      // Store the contact's source_id (email/phone) for this inbox for API use
      sourceIdMap.set(inbox.id, contactableInbox.source_id);

      // Get the inbox's sending email address from various possible properties
      // For OAuth email inboxes, the email is often in the `name` field
      // For SMTP email inboxes, it might be in `forward_to_email` or `email`
      const inboxEmail =
        inbox.name || // OAuth inboxes store email in name
        inbox.forward_to_email || // Forward-to email
        inbox.email || // Direct email property
        (inbox as any)._emailAccount?.email || // OAuth email account
        inbox.phone_number || // For SMS/WhatsApp
        `inbox-${inbox.id}@mail.gomake.com`; // Fallback generated email

      return {
        inboxId: inbox.id,
        inboxName: inbox.name || `Inbox ${inbox.id}`,
        sourceId: inboxEmail, // Display email/phone in dropdown
        channelType: inbox.channel_type,
      };
    });

    console.log(
      `[InboxResolutionService] Built ${senderOptions.length} sender option(s) from ${filteredInboxes.length} inbox(es)`
    );

    return {
      senderOptions,
      sourceIdMap,
    };
  }

  /**
   * Get default sender option (first option in the list)
   *
   * @param senderOptions - Array of sender options
   * @returns First sender option or null if array is empty
   */
  getDefaultSenderOption(senderOptions: EmailSenderOption[]): EmailSenderOption | null {
    if (senderOptions.length === 0) {
      console.warn("[InboxResolutionService] No sender options available");
      return null;
    }

    const defaultOption = senderOptions[0];
    console.log(`[InboxResolutionService] Default sender option: ${defaultOption.inboxName} (${defaultOption.sourceId})`);
    return defaultOption;
  }

  /**
   * Fetch contactable inboxes and build sender options in one call
   *
   * @param contactId - Chatwoot contact ID
   * @param channelType - Optional channel type to filter by
   * @returns Object containing sender options, source ID map, and default sender option
   */
  async resolveInboxesForContact(
    contactId: number,
    channelType?: string | ChannelType
  ): Promise<{
    senderOptions: EmailSenderOption[];
    sourceIdMap: InboxSourceIdMap;
    defaultSenderOption: EmailSenderOption | null;
    contactableInboxes: ContactableInbox[];
  }> {
    const contactableInboxes = await this.getContactableInboxes(contactId);
    const { senderOptions, sourceIdMap } = this.buildSenderOptions(contactableInboxes, channelType);
    const defaultSenderOption = this.getDefaultSenderOption(senderOptions);

    return {
      senderOptions,
      sourceIdMap,
      defaultSenderOption,
      contactableInboxes,
    };
  }

  /**
   * Deduplicate sender options by source ID
   * Useful when merging sender options from multiple sources
   *
   * @param options - Array of sender options
   * @returns Deduplicated array of sender options
   */
  deduplicateSenderOptions(options: EmailSenderOption[]): EmailSenderOption[] {
    const map = new Map<string, EmailSenderOption>();
    options.forEach((option) => {
      const key = `${option.inboxId}-${option.sourceId}`;
      if (!map.has(key)) {
        map.set(key, option);
      }
    });
    return Array.from(map.values());
  }
}

// Export singleton instance
export const inboxResolutionService = new InboxResolutionService();
