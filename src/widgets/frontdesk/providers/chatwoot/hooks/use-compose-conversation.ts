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
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetClientContacts } from "@/services/hooks/cart-side/customers/get-client-contacts";
import type {
  ComposeFormState,
  ComposeValidationErrors,
  CreateConversationPayload,
  getChannelRequirements,
} from "@/services/frontdesk/api/chatwoot/types/compose.types";
import type { ContactDetail, ContactCreatePayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import { extractContactPayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import type { ContactableInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { getChannelRequirements as getReqs } from "@/services/frontdesk/api/chatwoot/types/compose.types";

// Extended contact type with gomake contact DTO and customer info
export interface GomakeContact extends ContactDetail {
  gomake_contact_id?: string; // ID from gomake CRM system (contact DTO id)
  gomake_customer_id?: string; // Customer ID from gomake CRM system
  gomake_customer_name?: string; // Customer name for display
  gomake_client_code?: string; // Client code from gomake CRM system (maps to gomake_client_code custom attribute)
  gomake_agent_id?: string; // Agent ID from gomake CRM system
  gomake_is_main_contact?: boolean; // Whether this is the main contact for the customer
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export interface UseComposeConversationOptions {
  /** Account ID to use for operations */
  accountId: number | null;
  /** Callback on successful conversation creation */
  onSuccess?: (conversationId: number) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export function useComposeConversation(options?: UseComposeConversationOptions) {
  const accountId = options?.accountId;
  const currentUser = useRecoilValue(chatwootProfileAtom);
  const { callApi } = useGomakeAxios();

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
  const [searchResults, setSearchResults] = useState<GomakeContact[]>([]);
  const [contactableInboxes, setContactableInboxes] = useState<ContactableInbox[]>([]);
  const [isLoadingInboxes, setIsLoadingInboxes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ComposeValidationErrors>({});

  /**
   * Search customers and their contacts using gomake customer search
   * Similar to how customers page searches
   */
  const searchContacts = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Search customers using get-customers-pagination (like customers page)
        const result: any = await callApi(
          "GET",
          "/v1/customers/get-customers-pagination",
          {
            clientType: "C", // Search customers
            pageNumber: 1,
            pageSize: 20,
            name: query.trim(),
            isActive: true,
          },
          false
        );

        // Extract customer data from response
        const dataContainer = result?.data?.data?.data || result?.data?.data || {};
        const customers = dataContainer.data || dataContainer || [];
        
        if (!Array.isArray(customers) || customers.length === 0) {
          setSearchResults([]);
          return;
        }

        // For each customer, get their contacts
        const contactsPromises = customers.map(async (customer: any) => {
          try {
            // Call API directly to get the raw response structure
            const rawResult: any = await callApi(
              "GET",
              "/v1/crm-service/customer/get-client-contacts",
              { ClientId: customer.id || customer._id },
              false
            );

            console.log(`[useComposeConversation] Raw contacts result for customer ${customer.id}:`, rawResult);

            // Handle response structure: 
            // { status: "success", data: { data: [...] } }
            // returnResult extracts data.data.data by default, but actual structure is data.data
            let contactsArray: any[] = [];
            
            if (rawResult?.data?.data?.data && Array.isArray(rawResult.data.data.data)) {
              // Structure: data.data.data (what returnResult expects)
              contactsArray = rawResult.data.data.data;
            } else if (rawResult?.data?.data && Array.isArray(rawResult.data.data)) {
              // Structure: data.data (actual API response)
              contactsArray = rawResult.data.data;
            } else if (rawResult?.data && Array.isArray(rawResult.data)) {
              // Structure: data (fallback)
              contactsArray = rawResult.data;
            } else if (Array.isArray(rawResult)) {
              // Already an array
              contactsArray = rawResult;
            }

            console.log(`[useComposeConversation] Extracted contacts array for customer ${customer.id}:`, contactsArray);

            // Transform contacts to GomakeContact format
            const transformedContacts = contactsArray.map((contact: any) => ({
              id: undefined, // Will be set after Chatwoot search/create
              name: contact.name || "",
              email: contact.mail || contact.email || "",
              phone_number: contact.phone || contact.phone_number || "",
              gomake_contact_id: contact.id || contact._id || "",
              gomake_customer_id: customer.id || customer._id || "",
              gomake_customer_name: customer.name || "",
              gomake_client_code: customer.code || customer.customerCode || "",
              gomake_agent_id: customer.agentId || customer.agent_id || "",
              gomake_is_main_contact: contact.isMainContact || contact.is_main_contact || false,
            } as GomakeContact));

            console.log(`[useComposeConversation] Transformed contacts for customer ${customer.id}:`, transformedContacts);
            return transformedContacts;
          } catch (error) {
            console.error(`[useComposeConversation] Failed to get contacts for customer ${customer.id}:`, error);
            return [];
          }
        });

        const contactsArrays = await Promise.all(contactsPromises);
        const allContacts = contactsArrays.flat();

        console.log(`[useComposeConversation] All contacts arrays:`, contactsArrays);
        console.log(`[useComposeConversation] Flattened contacts:`, allContacts);

        // If customer has no contacts but has email/phone, create a contact from customer data
        customers.forEach((customer: any, customerIndex: number) => {
          const customerId = customer.id || customer._id;
          // Check if this customer has contacts by checking the corresponding array at the same index
          const customerContacts = contactsArrays[customerIndex] || [];
          const hasContacts = customerContacts.length > 0;
          
          console.log(`[useComposeConversation] Customer ${customerId} (index ${customerIndex}) hasContacts:`, hasContacts, `contacts count:`, customerContacts.length);
          
          if (!hasContacts && (customer.mail || customer.phone)) {
            const fallbackContact = {
              id: undefined,
              name: customer.name || "",
              email: customer.mail || customer.email || "",
              phone_number: customer.phone || customer.phone_number || "",
              gomake_contact_id: undefined, // No specific contact, use customer as contact
              gomake_customer_id: customerId,
              gomake_customer_name: customer.name || "",
              gomake_client_code: customer.code || customer.customerCode || "",
              gomake_agent_id: customer.agentId || customer.agent_id || "",
              gomake_is_main_contact: true, // Customer itself is main contact
            } as GomakeContact;
            console.log(`[useComposeConversation] Adding fallback contact for customer ${customerId}:`, fallbackContact);
            allContacts.push(fallbackContact);
          }
        });

        console.log(`[useComposeConversation] Final allContacts:`, allContacts);
        setSearchResults(allContacts);
      } catch (error) {
        console.error("[useComposeConversation] Contact search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [callApi]
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
    async (contact: ContactDetail | null) => {
      if (!contact || !contact.id) {
        setContactableInboxes([]);
        return;
      }

      setIsLoadingInboxes(true);
      try {
        const response = await chatwootService.contacts.getContactableInboxes(contact.id);

        const inboxes = response.payload || [];
        setContactableInboxes(inboxes);
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
   * When a gomake contact is clicked:
   * 1. Search Chatwoot for contact with gomake_contact_id custom attribute
   * 2. If found (1 result) → use that contact
   * 3. If not found (0 results) → create new contact in Chatwoot
   */
  const selectContact = useCallback(
    async (contact: GomakeContact | null) => {
      if (!contact) {
        setFormState((prev) => ({
          ...prev,
          contact: null,
          selectedContactableInbox: null,
        }));
        setValidationErrors((prev) => ({ ...prev, contact: undefined }));
        setSearchResults([]);
        setContactableInboxes([]);
        return;
      }

      if (!accountId) {
        console.error("[useComposeConversation] No account selected");
        return;
      }

      setIsSearching(true);
      try {
        let chatwootContact: ContactDetail | null = null;

        // If contact already has an id (already exists in Chatwoot), use it directly
        if (contact.id) {
          chatwootContact = contact as ContactDetail;
        }
        // If contact has gomake_contact_id, search Chatwoot for it
        else if (contact.gomake_contact_id) {
          const filters = [
            {
              attribute_key: "gomake_contact_id",
              filter_operator: "equal_to",
              values: [contact.gomake_contact_id],
              attribute_model: "standard",
            },
          ];

          const response = await chatwootService.contacts.filterContacts(
            accountId,
            { payload: filters },
            {
              include_contact_inboxes: false,
              page: 1,
              sort: "name",
            }
          );

          const foundContacts = response.payload || [];
          
          if (foundContacts.length === 1) {
            // Found existing contact in Chatwoot
            const foundContact = foundContacts[0];
            // Ensure we have a ContactDetail with id - if filter returns ContactListItem, convert it
            // Note: ContactListItem from filterContacts might not have all ContactDetail fields
            chatwootContact = {
              id: foundContact.id,
              name: foundContact.name,
              email: foundContact.email,
              phone_number: foundContact.phone_number,
              thumbnail: foundContact.thumbnail,
              additional_attributes: foundContact.additional_attributes,
              // If we need full contact details, we could fetch them here, but id should be enough for inbox fetch
            } as ContactDetail;
          } else if (foundContacts.length === 0) {
            // Not found, create new contact in Chatwoot
            const createPayload: ContactCreatePayload = {
              name: contact.name,
              email: contact.email,
              phone_number: contact.phone_number || undefined,
              // All gomake fields go in custom_attributes only (DTO is fixed)
              custom_attributes: {
                ...(contact.gomake_contact_id && {
                  gomake_contact_id: contact.gomake_contact_id,
                }),
                ...(contact.gomake_customer_id && {
                  gomake_customer_id: contact.gomake_customer_id,
                }),
                ...(contact.gomake_client_code && {
                  gomake_client_code: contact.gomake_client_code,
                }),
                ...(contact.gomake_agent_id && {
                  gomake_agent_id: contact.gomake_agent_id,
                }),
                gomake_is_main_contact: contact.gomake_is_main_contact || false,
              },
            };

            const createResponse = await chatwootService.contacts.createContact(accountId, createPayload);
            // Extract contact from response
            // Response structure: { payload: { contact: {...}, contact_inbox: {...} } }
            // or: { data: { payload: { contact: {...} } } }
            let extractedContact: ContactDetail | null = null;
            if (createResponse?.payload?.contact) {
              extractedContact = createResponse.payload.contact as ContactDetail;
            } else if (createResponse?.data?.payload?.contact) {
              extractedContact = createResponse.data.payload.contact as ContactDetail;
            } else if (createResponse?.payload && (createResponse.payload as any).id) {
              // Fallback: payload might be the contact directly
              extractedContact = createResponse.payload as ContactDetail;
            } else {
              // Try extractContactPayload as last resort
              extractedContact = extractContactPayload<ContactDetail>(createResponse);
            }
            chatwootContact = extractedContact;
          } else {
            // Multiple found (shouldn't happen, but handle it)
            console.warn(
              `[useComposeConversation] Multiple contacts found with gomake_contact_id ${contact.gomake_contact_id}, using first one`
            );
            const foundContact = foundContacts[0];
            // Ensure we have a ContactDetail with id
            chatwootContact = {
              id: foundContact.id,
              name: foundContact.name,
              email: foundContact.email,
              phone_number: foundContact.phone_number,
              thumbnail: foundContact.thumbnail,
              additional_attributes: foundContact.additional_attributes,
            } as ContactDetail;
          }
        } else {
          // No gomake_contact_id and no id, create new contact from customer data
          const createPayload: ContactCreatePayload = {
            name: contact.name,
            email: contact.email,
            phone_number: contact.phone_number || undefined,
            // All gomake fields go in custom_attributes only (DTO is fixed)
            custom_attributes: {
              ...(contact.gomake_customer_id && {
                gomake_customer_id: contact.gomake_customer_id,
              }),
              ...(contact.gomake_client_code && {
                gomake_client_code: contact.gomake_client_code,
              }),
              ...(contact.gomake_agent_id && {
                gomake_agent_id: contact.gomake_agent_id,
              }),
              gomake_is_main_contact: contact.gomake_is_main_contact || false,
            },
          };

          const createResponse = await chatwootService.contacts.createContact(accountId, createPayload);
          // Extract contact from response
          // Response structure: { payload: { contact: {...}, contact_inbox: {...} } }
          // or: { data: { payload: { contact: {...} } } }
          let extractedContact: ContactDetail | null = null;
          if (createResponse?.payload?.contact) {
            extractedContact = createResponse.payload.contact as ContactDetail;
          } else if (createResponse?.data?.payload?.contact) {
            extractedContact = createResponse.data.payload.contact as ContactDetail;
          } else if (createResponse?.payload && (createResponse.payload as any).id) {
            // Fallback: payload might be the contact directly
            extractedContact = createResponse.payload as ContactDetail;
          } else {
            // Try extractContactPayload as last resort
            extractedContact = extractContactPayload<ContactDetail>(createResponse);
          }
          chatwootContact = extractedContact;
        }

        if (chatwootContact && chatwootContact.id) {
          setFormState((prev) => ({
            ...prev,
            contact: chatwootContact,
            selectedContactableInbox: null, // Reset inbox when contact changes
          }));
          setValidationErrors((prev) => ({ ...prev, contact: undefined }));
          // Continue fetching inboxes after contact is selected/created
          try {
            await fetchContactableInboxes(chatwootContact);
          } catch (inboxError) {
            console.error("[useComposeConversation] Failed to fetch inboxes:", inboxError);
            // Don't throw - contact is still selected even if inbox fetch fails
          }
        } else {
          console.error("[useComposeConversation] Invalid contact response - missing id:", chatwootContact);
          options?.onError?.(new Error("Contact selection failed: Invalid contact response"));
        }
      } catch (error) {
        console.error("[useComposeConversation] Failed to select contact:", error);
        options?.onError?.(error as Error);
      } finally {
        setIsSearching(false);
      }
    },
    [accountId, fetchContactableInboxes, options]
  );

  /**
   * Create new contact
   */
  const createContact = useCallback(
    async (payload: ContactCreatePayload): Promise<ContactDetail | null> => {
      if (!accountId) return null;

      try {
        const createResponse = await chatwootService.contacts.createContact(accountId, payload);
        // Extract contact from response
        // Response structure: { payload: { contact: {...}, contact_inbox: {...} } }
        // or: { data: { payload: { contact: {...} } } }
        let extractedContact: ContactDetail | null = null;
        if (createResponse?.payload?.contact) {
          extractedContact = createResponse.payload.contact as ContactDetail;
        } else if (createResponse?.data?.payload?.contact) {
          extractedContact = createResponse.data.payload.contact as ContactDetail;
        } else if (createResponse?.payload && (createResponse.payload as any).id) {
          // Fallback: payload might be the contact directly
          extractedContact = createResponse.payload as ContactDetail;
        } else {
          // Try extractContactPayload as last resort
          extractedContact = extractContactPayload<ContactDetail>(createResponse);
        }
        return extractedContact;
      } catch (error) {
        console.error("[useComposeConversation] Failed to create contact:", error);
        // Re-throw error so CreateContactModal can handle field-specific errors (422)
        // Only call onError for non-422 errors to avoid duplicate error handling
        if ((error as any)?.status !== 422) {
          options?.onError?.(error as Error);
        }
        throw error;
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
    const errors: Partial<Record<keyof ComposeValidationErrors, string>> = {};

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

    setValidationErrors(errors as ComposeValidationErrors);
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

      // Extract conversation from response (check both data and payload fields)
      const conversation = response.data || response.payload;
      const conversationId = conversation?.id;

      if (conversationId) {
        options?.onSuccess?.(conversationId);
        // Reset form
        resetForm();
        return conversationId;
      }

      console.error("[useComposeConversation] No conversation ID in response:", response);
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
