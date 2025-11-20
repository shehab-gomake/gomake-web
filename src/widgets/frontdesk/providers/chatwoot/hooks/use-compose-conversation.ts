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
import type { ContactDetail, ContactCreatePayload, ContactUpdatePayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
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

/**
 * Check if query looks like an email address
 */
function looksLikeEmail(query: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(query.trim());
}

/**
 * Check if query looks like a phone number
 */
function looksLikePhone(query: string): boolean {
  // Remove common phone formatting characters
  const cleaned = query.trim().replace(/[\s\-\(\)]/g, "");
  // Check if it starts with + and has digits, or just has enough digits
  return /^\+?\d{7,}$/.test(cleaned);
}

export interface UseComposeConversationOptions {
  /** Account ID to use for operations */
  accountId: number | null;
  /** Callback on successful conversation creation */
  onSuccess?: (conversationId: number) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Sync Chatwoot contact with GoMake contact data
 * Compares existing Chatwoot contact with fresh GoMake data and updates if needed
 * 
 * @param accountId - Chatwoot account ID
 * @param chatwootContactId - Existing Chatwoot contact ID
 * @param gomakeContact - Fresh contact data from GoMake
 * @returns Updated ContactDetail
 */
async function syncContactWithGomakeData(
  accountId: number,
  chatwootContactId: number,
  gomakeContact: GomakeContact
): Promise<ContactDetail> {
  try {
    // Fetch current Chatwoot contact
    const currentContact = await chatwootService.contacts.getContactDetails(
      accountId,
      chatwootContactId
    );

    // Check if update is needed
    const currentCustomAttrs = (currentContact.custom_attributes || {}) as Record<string, unknown>;
    
    // Build expected values from GoMake contact
    const expectedCustomAttrs: Record<string, unknown> = {
      ...(gomakeContact.gomake_contact_id && { gomake_contact_id: gomakeContact.gomake_contact_id }),
      ...(gomakeContact.gomake_customer_id && { gomake_customer_id: gomakeContact.gomake_customer_id }),
      ...(gomakeContact.gomake_client_code && { gomake_client_code: gomakeContact.gomake_client_code }),
      ...(gomakeContact.gomake_agent_id && { gomake_agent_id: gomakeContact.gomake_agent_id }),
      gomake_is_main_contact: gomakeContact.gomake_is_main_contact || false,
    };

    // Check if basic fields or custom attributes changed
    const nameChanged = currentContact.name !== gomakeContact.name;
    const emailChanged = currentContact.email !== gomakeContact.email;
    const phoneChanged = currentContact.phone_number !== gomakeContact.phone_number;
    
    const customAttrsChanged = 
      currentCustomAttrs.gomake_contact_id !== expectedCustomAttrs.gomake_contact_id ||
      currentCustomAttrs.gomake_customer_id !== expectedCustomAttrs.gomake_customer_id ||
      currentCustomAttrs.gomake_client_code !== expectedCustomAttrs.gomake_client_code ||
      currentCustomAttrs.gomake_agent_id !== expectedCustomAttrs.gomake_agent_id ||
      currentCustomAttrs.gomake_is_main_contact !== expectedCustomAttrs.gomake_is_main_contact;

    if (nameChanged || emailChanged || phoneChanged || customAttrsChanged) {
      console.log(
        `[syncContactWithGomakeData] Contact data changed for Chatwoot ID ${chatwootContactId}, updating...`,
        {
          nameChanged: nameChanged ? `"${currentContact.name}" → "${gomakeContact.name}"` : null,
          emailChanged: emailChanged ? `"${currentContact.email}" → "${gomakeContact.email}"` : null,
          phoneChanged: phoneChanged ? `"${currentContact.phone_number}" → "${gomakeContact.phone_number}"` : null,
          customAttrsChanged,
        }
      );

      const updatePayload: ContactUpdatePayload = {};

      if (nameChanged) {
        updatePayload.name = gomakeContact.name;
      }
      if (emailChanged) {
        updatePayload.email = gomakeContact.email;
      }
      if (phoneChanged) {
        updatePayload.phone_number = gomakeContact.phone_number;
      }
      if (customAttrsChanged) {
        updatePayload.custom_attributes = expectedCustomAttrs;
      }

      // Update contact in Chatwoot
      const updatedContact = await chatwootService.contacts.updateContact(
        accountId,
        chatwootContactId,
        updatePayload
      );

      console.log(`[syncContactWithGomakeData] Contact ${chatwootContactId} synced successfully`);
      return updatedContact;
    } else {
      console.log(
        `[syncContactWithGomakeData] Contact data unchanged for Chatwoot ID ${chatwootContactId}, skipping sync`
      );
      return currentContact;
    }
  } catch (error) {
    console.error(`[syncContactWithGomakeData] Failed to sync contact: ${error}`);
    // Return the contact as-is if sync fails - don't block the flow
    return {
      id: chatwootContactId,
      name: gomakeContact.name,
      email: gomakeContact.email,
      phone_number: gomakeContact.phone_number,
      custom_attributes: {
        ...(gomakeContact.gomake_contact_id && { gomake_contact_id: gomakeContact.gomake_contact_id }),
        ...(gomakeContact.gomake_customer_id && { gomake_customer_id: gomakeContact.gomake_customer_id }),
        ...(gomakeContact.gomake_client_code && { gomake_client_code: gomakeContact.gomake_client_code }),
        ...(gomakeContact.gomake_agent_id && { gomake_agent_id: gomakeContact.gomake_agent_id }),
        gomake_is_main_contact: gomakeContact.gomake_is_main_contact || false,
      },
    } as ContactDetail;
  }
}

/**
 * Helper function to find existing contact by email or create new one
 * Implements the "find-or-create" pattern with 422 error recovery
 * 
 * @param accountId - Chatwoot account ID
 * @param createPayload - Contact creation payload
 * @returns ContactDetail if found/created, null otherwise
 */
async function findOrCreateContact(
  accountId: number,
  createPayload: ContactCreatePayload
): Promise<ContactDetail | null> {
  const logger = { log: console.log };
  let contactToReturn: ContactDetail | null = null;

  // Step 1: If email is provided, search for existing contact first
  if (createPayload.email?.trim()) {
    try {
      const searchResults = await chatwootService.contacts.searchContacts(
        accountId,
        createPayload.email.trim()
      );

      // Find exact email match (case-insensitive)
      const exactMatch = searchResults.payload?.find(
        (c) => c.email?.toLowerCase() === createPayload.email?.toLowerCase()
      );

      if (exactMatch?.id) {
        logger.log(
          `[findOrCreateContact] Found existing contact with email ${createPayload.email}, ID: ${exactMatch.id}`
        );
        return {
          id: exactMatch.id,
          name: exactMatch.name,
          email: exactMatch.email,
          phone_number: exactMatch.phone_number,
          thumbnail: exactMatch.thumbnail,
          additional_attributes: exactMatch.additional_attributes,
        } as ContactDetail;
      }
    } catch (searchError) {
      // Log search error but continue to creation attempt
      console.warn(
        `[findOrCreateContact] Failed to search for existing contact: ${searchError}`
      );
    }
  }

  // Step 2: Try to create new contact
  try {
    const createResponse = await chatwootService.contacts.createContact(accountId, createPayload);

    // createContact returns ContactDetail directly
    contactToReturn = createResponse;
  } catch (createError: any) {
    // Step 3: Handle 422 "Email has already been taken" by searching again
    if (createError?.status === 422 && createPayload.email?.trim()) {
      console.warn(
        `[findOrCreateContact] Contact creation failed with 422, attempting to find existing contact by email`
      );

      try {
        const searchResults = await chatwootService.contacts.searchContacts(
          accountId,
          createPayload.email.trim()
        );

        // Find exact email match
        const exactMatch = searchResults.payload?.find(
          (c) => c.email?.toLowerCase() === createPayload.email?.toLowerCase()
        );

        if (exactMatch?.id) {
          contactToReturn = {
            id: exactMatch.id,
            name: exactMatch.name,
            email: exactMatch.email,
            phone_number: exactMatch.phone_number,
            thumbnail: exactMatch.thumbnail,
            additional_attributes: exactMatch.additional_attributes,
          } as ContactDetail;

          logger.log(
            `[findOrCreateContact] Successfully recovered by finding existing contact ID: ${exactMatch.id}`
          );
        } else {
          // Couldn't find the contact even after 422 error - re-throw
          throw createError;
        }
      } catch (fallbackError) {
        // If fallback search also fails, throw the original creation error
        throw createError;
      }
    } else {
      // Not a 422 error or no email - re-throw
      throw createError;
    }
  }

  return contactToReturn;
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
            name: trimmedQuery, // Use email/phone as name
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
            chatwootContact = await syncContactWithGomakeData(
              accountId,
              contact.id,
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
              // Not found - create new contact, using email/phone as name if name is empty or equals email/phone
              const contactName = contact.name && contact.name !== contact.email && contact.name !== contact.phone_number
                ? contact.name
                : (contact.email || contact.phone_number || "Unnamed Contact");
              
              const createPayload: ContactCreatePayload = {
                name: contactName,
                email: contact.email || undefined,
                phone_number: contact.phone_number || undefined,
              };

              chatwootContact = await findOrCreateContact(accountId, createPayload);
            }
          } catch (searchError) {
            console.error("[useComposeConversation] Failed to search Chatwoot contacts:", searchError);
            // Fall through to create new contact
            const contactName = contact.name && contact.name !== contact.email && contact.name !== contact.phone_number
              ? contact.name
              : (contact.email || contact.phone_number || "Unnamed Contact");
            
            const createPayload: ContactCreatePayload = {
              name: contactName,
              email: contact.email || undefined,
              phone_number: contact.phone_number || undefined,
            };

            chatwootContact = await findOrCreateContact(accountId, createPayload);
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
            chatwootContact = await syncContactWithGomakeData(
              accountId,
              foundContact.id,
              contact
            );
          } else if (foundContacts.length === 0) {
            // Not found by gomake_contact_id, use find-or-create pattern
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

            chatwootContact = await findOrCreateContact(accountId, createPayload);
          } else {
            // Multiple found (shouldn't happen, but handle it)
            console.warn(
              `[useComposeConversation] Multiple contacts found with gomake_contact_id ${contact.gomake_contact_id}, using first one and syncing`
            );
            const foundContact = foundContacts[0];
            
            // Sync the first contact with latest GoMake data
            chatwootContact = await syncContactWithGomakeData(
              accountId,
              foundContact.id,
              contact
            );
          }
        } else {
          // No gomake_contact_id and no id, use find-or-create pattern
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

          chatwootContact = await findOrCreateContact(accountId, createPayload);
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

      // Extract conversation from response
      // Chatwoot returns conversation directly (not wrapped in data/payload)
      // But also check for wrapped formats for compatibility
      const conversation = response.data || response.payload || response;
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
