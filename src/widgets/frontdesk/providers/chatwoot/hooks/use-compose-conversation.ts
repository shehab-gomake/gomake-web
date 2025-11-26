/**
 * useComposeConversation Hook
 *
 * Business logic for composing and creating new conversations in Chatwoot.
 * Handles contact search, inbox selection, form validation, and conversation creation.
 */

import { useState, useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import {
  chatwootService,
  contactResolutionService,
  conversationComposerService,
  looksLikeEmail,
  looksLikePhone,
  validateEmails,
} from "@/services/frontdesk";
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
import { getCapitalizedNameFromEmail } from "../utils/contact-utils";
import type { GomakeContact } from "@/services/frontdesk/api/chatwoot/services/chatwoot-contact-resolution.service";

// Re-export GomakeContact for convenience
export type { GomakeContact };

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
   * If no GoMake results found, searches Chatwoot contacts
   * Similar to how customers page searches
   */
  const searchContacts = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      const trimmedQuery = query.trim();
      const isEmailQuery = looksLikeEmail(trimmedQuery);
      const isPhoneQuery = looksLikePhone(trimmedQuery);

      try {
        // Step 1: Always search GoMake customers first (by name)
        let customerResult: any = null;
        try {
          customerResult = await callApi(
            "GET",
            "/v1/customers/get-customers-pagination",
            {
              clientType: "C", // Search customers
              pageNumber: 1,
              pageSize: 20,
              name: trimmedQuery,
              isActive: true,
            },
            false
          );
        } catch (error) {
          console.error("[useComposeConversation] GoMake customer search failed:", error);
        }

        // Process GoMake customers
        let gomakeContacts: GomakeContact[] = [];
        if (customerResult) {
          const dataContainer = customerResult?.data?.data?.data || customerResult?.data?.data || {};
          const customers = dataContainer.data || dataContainer || [];
          
          if (Array.isArray(customers) && customers.length > 0) {
            // For each customer, get their contacts
            const contactsPromises = customers.map(async (customer: any) => {
              try {
                const rawResult: any = await callApi(
                  "GET",
                  "/v1/crm-service/customer/get-client-contacts",
                  { ClientId: customer.id || customer._id },
                  false
                );

                let contactsArray: any[] = [];
                
                if (rawResult?.data?.data?.data && Array.isArray(rawResult.data.data.data)) {
                  contactsArray = rawResult.data.data.data;
                } else if (rawResult?.data?.data && Array.isArray(rawResult.data.data)) {
                  contactsArray = rawResult.data.data;
                } else if (rawResult?.data && Array.isArray(rawResult.data)) {
                  contactsArray = rawResult.data;
                } else if (Array.isArray(rawResult)) {
                  contactsArray = rawResult;
                }

                // Transform contacts to GomakeContact format
                const transformedContacts = contactsArray.map((contact: any) => ({
                  id: undefined,
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

                return transformedContacts;
              } catch (error) {
                console.error(`[useComposeConversation] Failed to get contacts for customer ${customer.id}:`, error);
                return [];
              }
            });

            const contactsArrays = await Promise.all(contactsPromises);
            gomakeContacts = contactsArrays.flat();

            // If customer has no contacts but has email/phone, create a contact from customer data
            customers.forEach((customer: any, customerIndex: number) => {
              const customerId = customer.id || customer._id;
              const customerContacts = contactsArrays[customerIndex] || [];
              const hasContacts = customerContacts.length > 0;
              
              if (!hasContacts && (customer.mail || customer.phone)) {
                const fallbackContact = {
                  id: undefined,
                  name: customer.name || "",
                  email: customer.mail || customer.email || "",
                  phone_number: customer.phone || customer.phone_number || "",
                  gomake_contact_id: undefined,
                  gomake_customer_id: customerId,
                  gomake_customer_name: customer.name || "",
                  gomake_client_code: customer.code || customer.customerCode || "",
                  gomake_agent_id: customer.agentId || customer.agent_id || "",
                  gomake_is_main_contact: true,
                } as GomakeContact;
                gomakeContacts.push(fallbackContact);
              }
            });
          }
        }

        // Step 2: If no GoMake results found, search Chatwoot contacts
        let chatwootContacts: GomakeContact[] = [];
        if (gomakeContacts.length === 0 && accountId) {
          try {
            const chatwootResult = await chatwootService.contacts.searchContacts(accountId, trimmedQuery);
            
            if (chatwootResult && chatwootResult.payload) {
              chatwootContacts = (chatwootResult.payload || []).map((contact: ContactDetail) => {
                const customAttrs = (contact.custom_attributes || {}) as Record<string, unknown>;
                return {
                  id: contact.id,
                  name: contact.name || "",
                  email: contact.email || "",
                  phone_number: contact.phone_number || "",
                  thumbnail: contact.thumbnail,
                  // Preserve gomake custom attributes if they exist (contact might have been synced before)
                  gomake_contact_id: customAttrs.gomake_contact_id as string | undefined,
                  gomake_customer_id: customAttrs.gomake_customer_id as string | undefined,
                  gomake_customer_name: undefined, // Not stored in custom_attributes
                  gomake_client_code: customAttrs.gomake_client_code as string | undefined,
                  gomake_agent_id: customAttrs.gomake_agent_id as string | undefined,
                  gomake_is_main_contact: (customAttrs.gomake_is_main_contact as boolean) || false,
                } as GomakeContact;
              });
            }
          } catch (error) {
            console.error("[useComposeConversation] Chatwoot contact search failed:", error);
          }
        }

        // Combine results (GoMake contacts take priority, Chatwoot contacts are added if no GoMake results)
        const allContacts: GomakeContact[] = [...gomakeContacts, ...chatwootContacts];

        // If no results found and query looks like email/phone, add a "create new" suggestion
        if (allContacts.length === 0 && (isEmailQuery || isPhoneQuery)) {
          const createSuggestion: GomakeContact = {
            id: undefined,
            name: isEmailQuery ? getCapitalizedNameFromEmail(trimmedQuery) : trimmedQuery, // Generate name from email, use phone as-is
            email: isEmailQuery ? trimmedQuery : undefined,
            phone_number: isPhoneQuery ? trimmedQuery : undefined,
            gomake_contact_id: undefined,
            gomake_customer_id: undefined,
            gomake_customer_name: undefined,
            gomake_client_code: undefined,
            gomake_agent_id: undefined,
            gomake_is_main_contact: false,
          } as GomakeContact;
          allContacts.push(createSuggestion);
        }

        setSearchResults(allContacts);
      } catch (error) {
        console.error("[useComposeConversation] Contact search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [callApi, accountId]
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

        // If contact already has an id (already exists in Chatwoot)
        if (contact.id) {
          // If it's a GoMake contact, sync with latest GoMake data before using it
          if (contact.gomake_contact_id) {
            console.log(
              `[useComposeConversation] Contact has Chatwoot ID ${contact.id} and gomake_contact_id ${contact.gomake_contact_id}, syncing with GoMake data...`
            );
            chatwootContact = await contactResolutionService.syncContactWithGomakeData(
              accountId,
              contact.id!,
              contact
            );
          } else {
            // Not a GoMake contact, use it directly
            chatwootContact = contact as ContactDetail;
          }
        }
        // If contact has email/phone but no ID, search Chatwoot by email/phone first
        else if ((contact.email || contact.phone_number) && !contact.gomake_contact_id) {
          // This is likely an email/phone suggestion - search Chatwoot for existing contact
          const searchQuery = contact.email || contact.phone_number || "";
          try {
            const searchResults = await chatwootService.contacts.searchContacts(
              accountId,
              searchQuery
            );

            // Find exact match
            const exactMatch = searchResults.payload?.find((c: ContactDetail) => {
              if (contact.email && c.email) {
                return c.email.toLowerCase() === contact.email.toLowerCase();
              }
              if (contact.phone_number && c.phone_number) {
                return c.phone_number === contact.phone_number;
              }
              return false;
            });

            if (exactMatch?.id) {
              // Found existing contact
              chatwootContact = exactMatch;
            } else {
              // Not found - create new contact, generating name from email if needed
              let contactName: string;
              if (contact.name && contact.name !== contact.email && contact.name !== contact.phone_number) {
                // Use provided name if it's different from email/phone
                contactName = contact.name;
              } else if (contact.email) {
                // Generate name from email (Chatwoot behavior)
                contactName = getCapitalizedNameFromEmail(contact.email);
              } else {
                // Fallback to phone number or default
                contactName = contact.phone_number || "Unnamed Contact";
              }
              
              const createPayload: ContactCreatePayload = {
                name: contactName,
                email: contact.email || undefined,
                phone_number: contact.phone_number || undefined,
              };

              chatwootContact = await contactResolutionService.findOrCreateContact(accountId, createPayload);
            }
          } catch (searchError) {
            console.error("[useComposeConversation] Failed to search Chatwoot contacts:", searchError);
            // Fall through to create new contact, generating name from email if needed
            let contactName: string;
            if (contact.name && contact.name !== contact.email && contact.name !== contact.phone_number) {
              // Use provided name if it's different from email/phone
              contactName = contact.name;
            } else if (contact.email) {
              // Generate name from email (Chatwoot behavior)
              contactName = getCapitalizedNameFromEmail(contact.email);
            } else {
              // Fallback to phone number or default
              contactName = contact.phone_number || "Unnamed Contact";
            }

            const createPayload: ContactCreatePayload = {
              name: contactName,
              email: contact.email || undefined,
              phone_number: contact.phone_number || undefined,
            };

            chatwootContact = await contactResolutionService.findOrCreateContact(accountId, createPayload);
          }
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
            // Found existing contact in Chatwoot - sync with latest GoMake data
            const foundContact = foundContacts[0];
            console.log(
              `[useComposeConversation] Found existing contact in Chatwoot (ID: ${foundContact.id}), syncing with GoMake data...`
            );

            // Sync the contact with latest GoMake data before using it
            chatwootContact = await contactResolutionService.syncContactWithGomakeData(
              accountId,
              foundContact.id!,
              contact
            );
          } else if (foundContacts.length === 0) {
            // Not found by gomake_contact_id, use find-or-create pattern
            // Generate name from email if name is empty or equals email
            let contactName: string = contact.name;
            if (!contactName || contactName === contact.email) {
              contactName = contact.email ? getCapitalizedNameFromEmail(contact.email) : (contact.phone_number || "Unnamed Contact");
            }

            const createPayload: ContactCreatePayload = {
              name: contactName,
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

            chatwootContact = await contactResolutionService.findOrCreateContact(accountId, createPayload);
          } else {
            // Multiple found (shouldn't happen, but handle it)
            console.warn(
              `[useComposeConversation] Multiple contacts found with gomake_contact_id ${contact.gomake_contact_id}, using first one and syncing`
            );
            const foundContact = foundContacts[0];

            // Sync the first contact with latest GoMake data
            chatwootContact = await contactResolutionService.syncContactWithGomakeData(
              accountId,
              foundContact.id!,
              contact
            );
          }
        } else {
          // No gomake_contact_id and no id, use find-or-create pattern
          // Generate name from email if name is empty or equals email
          let contactName: string = contact.name;
          if (!contactName || contactName === contact.email) {
            contactName = contact.email ? getCapitalizedNameFromEmail(contact.email) : (contact.phone_number || "Unnamed Contact");
          }

          const createPayload: ContactCreatePayload = {
            name: contactName,
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

          chatwootContact = await contactResolutionService.findOrCreateContact(accountId, createPayload);
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
        // createContact returns ContactDetail directly
        return createResponse;
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
   * Prepare payload for conversation creation using ConversationComposerService
   */
  const preparePayload = useCallback((): FormData | CreateConversationPayload => {
    const { contact, selectedContactableInbox, message, subject, ccEmails, bccEmails, attachments } =
      formState;

    if (!contact?.id || !selectedContactableInbox) {
      throw new Error("Contact and inbox are required");
    }

    return conversationComposerService.prepareConversationPayload({
      inboxId: selectedContactableInbox.inbox.id,
      contactId: contact.id,
      sourceId: selectedContactableInbox.source_id,
      message,
      subject,
      ccEmails,
      bccEmails,
      attachments,
      assigneeId: currentUser?.id,
      channelType: selectedContactableInbox.inbox.channel_type,
    });
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
   * Submit form and create conversation using ConversationComposerService
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
      const conversationId = await conversationComposerService.createConversation(accountId, payload);

      if (conversationId) {
        options?.onSuccess?.(conversationId);
        // Reset form
        resetForm();
        return conversationId;
      }

      console.error("[useComposeConversation] Failed to create conversation: No conversation ID returned");
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
