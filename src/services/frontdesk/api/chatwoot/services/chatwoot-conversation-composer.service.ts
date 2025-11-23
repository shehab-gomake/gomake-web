/**
 * Chatwoot Conversation Composer Service
 *
 * Handles conversation creation payload preparation and submission.
 * Consolidates shared logic used by both FrontDesk Chatwoot and Quote Page modals.
 *
 * Key Features:
 * - Payload preparation (FormData vs JSON based on attachments)
 * - Email-specific field handling (subject, cc, bcc)
 * - Document metadata support for quote/document modals
 * - Channel-aware payload formatting
 */

import { chatwootService } from "@/services/frontdesk";
import type { CreateConversationPayload } from "@/services/frontdesk/api/chatwoot/types/compose.types";

/**
 * Options for preparing a conversation creation payload
 */
export interface PrepareConversationPayloadOptions {
  // Required fields
  inboxId: number;
  contactId: number;
  sourceId: string; // Contact's identifier in the channel (email, phone, etc.)

  // Optional fields
  message?: string;
  subject?: string;
  ccEmails?: string | string[]; // Can be comma-separated string or array
  bccEmails?: string | string[]; // Can be comma-separated string or array
  toEmails?: string | string[]; // For email channels (optional, can be used in content_attributes)
  attachments?: File[];
  assigneeId?: number;
  channelType?: string; // e.g., "Channel::Email"

  // Additional metadata
  additionalAttributes?: Record<string, any>;
  contentType?: string; // e.g., "input_email"
  contentAttributes?: Record<string, any>; // For email metadata
}

/**
 * Conversation Composer Service
 *
 * Provides reusable methods for conversation creation payload preparation and submission.
 */
export class ConversationComposerService {
  /**
   * Normalize email input to comma-separated string
   * Handles both string and array inputs
   */
  private normalizeEmails(emails?: string | string[]): string {
    if (!emails) return "";
    if (Array.isArray(emails)) {
      return emails.filter(Boolean).join(",");
    }
    return emails;
  }

  /**
   * Prepare conversation creation payload
   * Handles attachments (FormData) vs no attachments (JSON)
   *
   * @param options - Payload preparation options
   * @returns FormData or JSON payload
   */
  prepareConversationPayload(options: PrepareConversationPayloadOptions): FormData | CreateConversationPayload {
    const {
      inboxId,
      contactId,
      sourceId,
      message,
      subject,
      ccEmails,
      bccEmails,
      toEmails,
      attachments = [],
      assigneeId,
      channelType,
      additionalAttributes = {},
      contentType,
      contentAttributes = {},
    } = options;

    const hasAttachments = attachments.length > 0;
    const isEmailChannel = channelType === "Channel::Email" || channelType === "email";

    // Normalize email fields
    const normalizedCc = this.normalizeEmails(ccEmails);
    const normalizedBcc = this.normalizeEmails(bccEmails);
    const normalizedTo = this.normalizeEmails(toEmails);

    // Build content_attributes for email metadata (if needed)
    const finalContentAttributes: Record<string, any> = { ...contentAttributes };

    // Add email recipients to content_attributes if provided
    if (normalizedTo || normalizedCc || normalizedBcc) {
      finalContentAttributes.email = finalContentAttributes.email || {};
      if (normalizedTo) {
        finalContentAttributes.email.to = normalizedTo.split(",").filter(Boolean);
      }
      if (normalizedCc) {
        finalContentAttributes.email.cc = normalizedCc.split(",").filter(Boolean);
      }
      if (normalizedBcc) {
        finalContentAttributes.email.bcc = normalizedBcc.split(",").filter(Boolean);
      }
    }

    // Build additional_attributes
    const finalAdditionalAttributes: Record<string, any> = { ...additionalAttributes };
    if (isEmailChannel && subject) {
      finalAdditionalAttributes.mail_subject = subject;
    }

    if (hasAttachments) {
      // Use FormData for attachments
      const formData = new FormData();
      formData.append("inbox_id", inboxId.toString());
      formData.append("contact_id", contactId.toString());
      formData.append("source_id", sourceId);
      formData.append("status", "open");

      // Assignee
      if (assigneeId) {
        formData.append("assignee_id", assigneeId.toString());
      }

      // Message
      if (message) {
        formData.append("message[content]", message);
      }

      // Content type
      if (contentType) {
        formData.append("message[content_type]", contentType);
      }

      // Email-specific fields
      if (isEmailChannel) {
        if (normalizedCc) {
          formData.append("message[cc_emails]", normalizedCc);
        }
        if (normalizedBcc) {
          formData.append("message[bcc_emails]", normalizedBcc);
        }
      }

      // Content attributes
      if (Object.keys(finalContentAttributes).length > 0) {
        formData.append("message[content_attributes]", JSON.stringify(finalContentAttributes));
      }

      // Additional attributes
      Object.entries(finalAdditionalAttributes).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          // Handle nested objects (e.g., gomake_document)
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            formData.append(
              `additional_attributes[${key}][${nestedKey}]`,
              String(nestedValue)
            );
          });
        } else {
          formData.append(`additional_attributes[${key}]`, String(value));
        }
      });

      // Attachments
      attachments.forEach((file) => {
        formData.append("message[attachments][]", file);
      });

      return formData;
    } else {
      // Use JSON for no attachments
      const payload: CreateConversationPayload = {
        inbox_id: inboxId,
        contact_id: contactId,
        source_id: sourceId,
        status: "open",
        ...(assigneeId && { assignee_id: assigneeId }),
      };

      // Message
      const hasMessageContent = message || normalizedCc || normalizedBcc || Object.keys(finalContentAttributes).length > 0;

      if (hasMessageContent) {
        payload.message = {
          content: message || "",
          ...(contentType && { content_type: contentType }),
          ...(Object.keys(finalContentAttributes).length > 0 && {
            content_attributes: finalContentAttributes,
          }),
        };

        // Email-specific fields
        if (isEmailChannel) {
          if (normalizedCc) payload.message.cc_emails = normalizedCc;
          if (normalizedBcc) payload.message.bcc_emails = normalizedBcc;
        }
      }

      // Additional attributes
      if (Object.keys(finalAdditionalAttributes).length > 0) {
        payload.additional_attributes = finalAdditionalAttributes;
      }

      return payload;
    }
  }

  /**
   * Create conversation and extract conversation ID from response
   *
   * @param accountId - Chatwoot account ID
   * @param payload - Conversation creation payload (FormData or JSON)
   * @returns Conversation ID if successful, null otherwise
   */
  async createConversation(
    accountId: number,
    payload: FormData | CreateConversationPayload
  ): Promise<number | null> {
    try {
      const response = await chatwootService.conversations.createConversation(accountId, payload);

      // Extract conversation from response
      // Chatwoot returns conversation directly (not wrapped in data/payload)
      // But also check for wrapped formats for compatibility
      const conversation = (response as any)?.data || (response as any)?.payload || response;
      const conversationId = conversation?.id;

      if (conversationId) {
        console.log(`[ConversationComposerService] Created conversation ID: ${conversationId}`);
        return conversationId;
      }

      console.error("[ConversationComposerService] No conversation ID in response:", response);
      return null;
    } catch (error) {
      console.error("[ConversationComposerService] Failed to create conversation:", error);
      throw error;
    }
  }

  /**
   * Prepare and create conversation in one call
   *
   * @param accountId - Chatwoot account ID
   * @param options - Payload preparation options
   * @returns Conversation ID if successful, null otherwise
   */
  async composeAndCreate(
    accountId: number,
    options: PrepareConversationPayloadOptions
  ): Promise<number | null> {
    const payload = this.prepareConversationPayload(options);
    return this.createConversation(accountId, payload);
  }
}

// Export singleton instance
export const conversationComposerService = new ConversationComposerService();
