/**
 * useComposeConversation Hook
 *
 * Business logic for composing and creating new conversations in Chatwoot.
 * Handles contact search, inbox selection, form validation, and conversation creation.
 */

import { useState, useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { chatwootSelectedAccountAtom, chatwootProfileAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type {
  ComposeFormState,
  ComposeValidationErrors,
  CreateConversationPayload,
  getChannelRequirements,
} from "@/services/frontdesk/api/chatwoot/types/compose.types";
import type { ContactDetail, ContactCreatePayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import type { ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { getChannelRequirements as getReqs } from "@/services/frontdesk/api/chatwoot/types/compose.types";

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export interface UseComposeConversationOptions {
  /** Callback on successful conversation creation */
  onSuccess?: (conversationId: number) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export function useComposeConversation(options?: UseComposeConversationOptions) {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const currentUser = useRecoilValue(chatwootProfileAtom);

  // Form state
  const [formState, setFormState] = useState<ComposeFormState>({
    contact: null,
    selectedContactableInbox: null,
    message: "",
    subject: "",
    ccEmails: "",
    bccEmails: "",
    attachments: [],
  });

  // UI state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ContactDetail[]>([]);
  const [contactableInboxes, setContactableInboxes] = useState<ContactableInbox[]>([]);
  const [isLoadingInboxes, setIsLoadingInboxes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ComposeValidationErrors>({});

  /**
   * Detect query type for smarter search
   * Returns which fields to search based on query pattern
   */
  const detectQueryType = useCallback((query: string) => {
    const hasAlphabet = /[a-zA-Z]/.test(query);
    const isEmailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);
    const isPhoneLike = /^[\d\s\-\+\(\)]+$/.test(query);

    return {
      searchEmail: true, // Always search email
      searchPhone: !hasAlphabet, // Only search phone if no letters
      searchName: !isEmailLike, // Skip name if it looks like an email
    };
  }, []);

  /**
   * Search contacts using filter API with smart query detection
   * Note: Backend automatically handles accountId from authentication context
   */
  const searchContacts = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Smart query detection - only search relevant fields
        const { searchEmail, searchPhone, searchName } = detectQueryType(query);

        const filters: any[] = [];

        if (searchEmail) {
          filters.push({
            attribute_key: "email",
            filter_operator: "contains",
            values: [query],
            attribute_model: "standard",
            query_operator: "or",
          });
        }

        if (searchName) {
          filters.push({
            attribute_key: "name",
            filter_operator: "contains",
            values: [query],
            attribute_model: "standard",
          });
        }

        if (searchPhone) {
          filters.push({
            attribute_key: "phone_number",
            filter_operator: "contains",
            values: [query],
            attribute_model: "standard",
          });
        }

        const response = await chatwootService.contacts.filterContacts({
          payload: filters,
        });

        const contacts = response.payload || [];
        setSearchResults(contacts);
      } catch (error) {
        console.error("[useComposeConversation] Contact search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [detectQueryType]
  );

  // Debounced search (300ms)
  const debouncedSearchContacts = useMemo(
    () => debounce(searchContacts, 300),
    [searchContacts]
  );

  /**
   * Fetch contactable inboxes for selected contact
   * Note: Backend automatically handles accountId from authentication context
   */
  const fetchContactableInboxes = useCallback(
    async (contact: ContactDetail) => {
      if (!contact.id) {
        setContactableInboxes([]);
        return;
      }

      setIsLoadingInboxes(true);
      try {
        const response = await chatwootService.contacts.getContactableInboxes(contact.id);

        const inboxes = response.payload || [];
        setContactableInboxes(inboxes);

        // Auto-select first inbox if only one available
        if (inboxes.length === 1) {
          setFormState((prev) => ({
            ...prev,
            selectedContactableInbox: inboxes[0],
          }));
        }
      } catch (error) {
        console.error("[useComposeConversation] Failed to fetch contactable inboxes:", error);
        setContactableInboxes([]);
      } finally {
        setIsLoadingInboxes(false);
      }
    },
    []
  );

  /**
   * Handle contact selection
   */
  const selectContact = useCallback(
    (contact: ContactDetail) => {
      setFormState((prev) => ({
        ...prev,
        contact,
        selectedContactableInbox: null, // Reset inbox when contact changes
      }));
      setValidationErrors((prev) => ({ ...prev, contact: undefined }));

      // Fetch contactable inboxes
      fetchContactableInboxes(contact);
    },
    [fetchContactableInboxes]
  );

  /**
   * Create new contact
   */
  const createContact = useCallback(
    async (payload: ContactCreatePayload): Promise<ContactDetail | null> => {
      if (!accountId) return null;

      try {
        const newContact = await chatwootService.contacts.createContact(accountId, payload);
        return newContact;
      } catch (error) {
        console.error("[useComposeConversation] Failed to create contact:", error);
        options?.onError?.(error as Error);
        return null;
      }
    },
    [accountId, options]
  );

  /**
   * Update form field
   */
  const updateField = useCallback(
    <K extends keyof ComposeFormState>(field: K, value: ComposeFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  /**
   * Validate form based on channel requirements
   */
  const validateForm = useCallback((): boolean => {
    const errors: ComposeValidationErrors = {};

    // Contact required
    if (!formState.contact) {
      errors.contact = "Contact is required";
    }

    // Inbox required
    if (!formState.selectedContactableInbox) {
      errors.inbox = "Inbox is required";
    }

    // Channel-specific validation
    if (formState.selectedContactableInbox) {
      const channelType = formState.selectedContactableInbox.inbox.channel_type;
      const requirements = getReqs(channelType);

      // Subject required for email
      if (requirements.subjectRequired && !formState.subject?.trim()) {
        errors.subject = "Subject is required for email conversations";
      }

      // Message required (unless WhatsApp with template)
      if (requirements.messageRequired && !formState.message?.trim()) {
        if (channelType === "Channel::WhatsApp" && formState.templateParams) {
          // Template provided, message not required
        } else {
          errors.message = "Message is required";
        }
      }

      // Validate email addresses
      if (formState.ccEmails && !validateEmails(formState.ccEmails)) {
        errors.ccEmails = "Invalid CC email addresses";
      }
      if (formState.bccEmails && !validateEmails(formState.bccEmails)) {
        errors.bccEmails = "Invalid BCC email addresses";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formState]);

  /**
   * Prepare payload for conversation creation
   */
  const preparePayload = useCallback((): FormData | CreateConversationPayload => {
    const { contact, selectedContactableInbox, message, subject, ccEmails, bccEmails, attachments } =
      formState;

    if (!contact?.id || !selectedContactableInbox) {
      throw new Error("Contact and inbox are required");
    }

    const hasAttachments = attachments.length > 0;
    const channelType = selectedContactableInbox.inbox.channel_type;

    if (hasAttachments) {
      // Use FormData for attachments
      const formData = new FormData();
      formData.append("inbox_id", selectedContactableInbox.inbox.id.toString());
      formData.append("contact_id", contact.id.toString());
      formData.append("source_id", selectedContactableInbox.source_id);
      formData.append("status", "open");

      // Auto-assign to current user
      if (currentUser?.id) {
        formData.append("assignee_id", currentUser.id.toString());
      }

      // Message
      if (message) {
        formData.append("message[content]", message);
      }

      // Email-specific fields
      if (channelType === "Channel::Email") {
        if (subject) {
          formData.append("additional_attributes[mail_subject]", subject);
        }
        if (ccEmails) {
          formData.append("message[cc_emails]", ccEmails);
        }
        if (bccEmails) {
          formData.append("message[bcc_emails]", bccEmails);
        }
      }

      // Attachments
      attachments.forEach((file) => {
        formData.append("message[attachments][]", file);
      });

      return formData;
    } else {
      // Use JSON for no attachments
      const payload: CreateConversationPayload = {
        inbox_id: selectedContactableInbox.inbox.id,
        contact_id: contact.id,
        source_id: selectedContactableInbox.source_id,
        status: "open",
        ...(currentUser?.id && { assignee_id: currentUser.id }),
      };

      // Message
      if (message || ccEmails || bccEmails) {
        payload.message = {
          content: message,
        };

        if (channelType === "Channel::Email") {
          if (ccEmails) payload.message.cc_emails = ccEmails;
          if (bccEmails) payload.message.bcc_emails = bccEmails;
        }
      }

      // Email subject
      if (channelType === "Channel::Email" && subject) {
        payload.additional_attributes = {
          mail_subject: subject,
        };
      }

      return payload;
    }
  }, [formState, currentUser]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormState({
      contact: null,
      selectedContactableInbox: null,
      message: "",
      subject: "",
      ccEmails: "",
      bccEmails: "",
      attachments: [],
    });
    setSearchResults([]);
    setContactableInboxes([]);
    setValidationErrors({});
  }, []);

  /**
   * Submit form and create conversation
   */
  const submit = useCallback(async (): Promise<number | null> => {
    if (!accountId) {
      console.error("[useComposeConversation] No account selected");
      return null;
    }

    // Validate
    if (!validateForm()) {
      return null;
    }

    setIsSubmitting(true);
    try {
      const payload = preparePayload();
      const response = await chatwootService.conversations.createConversation(accountId, payload);

      // Extract conversation from response (could be in data or payload)
      const conversation = response.data || response.payload;
      const conversationId = conversation?.id;

      if (conversationId) {
        options?.onSuccess?.(conversationId);
        // Reset form
        resetForm();
        return conversationId;
      }

      return null;
    } catch (error) {
      console.error("[useComposeConversation] Failed to create conversation:", error);
      options?.onError?.(error as Error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [accountId, validateForm, preparePayload, options, resetForm]);

  return {
    // Form state
    formState,
    updateField,

    // Contact search
    searchResults,
    isSearching,
    searchContacts: debouncedSearchContacts,
    selectContact,
    createContact,

    // Inboxes
    contactableInboxes,
    isLoadingInboxes,

    // Validation
    validationErrors,
    validateForm,

    // Submission
    isSubmitting,
    submit,
    resetForm,
  };
}

/**
 * Validate comma-separated email addresses
 */
function validateEmails(emails: string): boolean {
  const emailList = emails.split(",").map((e) => e.trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailList.every((email) => emailRegex.test(email));
}
