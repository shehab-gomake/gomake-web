/**
 * Chatwoot Contact Resolution Service
 *
 * Handles contact resolution, creation, and synchronization with GoMake CRM data.
 * Consolidates shared logic used by both FrontDesk Chatwoot and Quote Page modals.
 *
 * Key Features:
 * - Find-or-create contact pattern with 422 error recovery
 * - Contact resolution from GoMake customer data
 * - Contact synchronization with GoMake CRM
 */

import { chatwootService } from "@/services/frontdesk";
import type {
  ContactDetail,
  ContactCreatePayload,
  ContactUpdatePayload
} from "@/services/frontdesk/api/chatwoot/types/contacts.types";

/**
 * Extended contact type with GoMake contact DTO and customer info
 */
export interface GomakeContact extends ContactDetail {
  gomake_contact_id?: string; // ID from GoMake CRM system (contact DTO id)
  gomake_customer_id?: string | number; // Customer ID from GoMake CRM system
  gomake_customer_name?: string; // Customer name for display
  gomake_client_code?: string; // Client code from GoMake CRM system
  gomake_agent_id?: string; // Agent ID from GoMake CRM system
  gomake_is_main_contact?: boolean; // Whether this is the main contact for the customer
}

/**
 * Options for contact resolution from GoMake customer
 */
export interface ResolveContactOptions {
  customerId?: string | number;
  contactEmail?: string;
  contactName?: string;
  contactPhone?: string;
}

/**
 * GoMake API client type (from useGomakeAxios)
 */
export interface GomakeApiClient {
  callApi: (method: string, url: string, params: any, showLoader?: boolean) => Promise<any>;
}

/**
 * Contact Resolution Service
 *
 * Provides reusable methods for contact resolution, creation, and synchronization.
 */
export class ContactResolutionService {
  /**
   * Find existing contact by email or create new one
   * Implements the "find-or-create" pattern with 422 error recovery
   *
   * @param accountId - Chatwoot account ID
   * @param createPayload - Contact creation payload
   * @returns ContactDetail if found/created, null otherwise
   */
  async findOrCreateContact(
    accountId: number,
    createPayload: ContactCreatePayload
  ): Promise<ContactDetail | null> {
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
          console.log(
            `[ContactResolutionService] Found existing contact with email ${createPayload.email}, ID: ${exactMatch.id}`
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
          `[ContactResolutionService] Failed to search for existing contact: ${searchError}`
        );
      }
    }

    // Step 2: Try to create new contact
    try {
      const createResponse = await chatwootService.contacts.createContact(
        accountId,
        createPayload
      );

      // createContact returns ContactDetail directly
      contactToReturn = createResponse;
      console.log(
        `[ContactResolutionService] Created new contact, ID: ${createResponse.id}`
      );
    } catch (createError: any) {
      // Step 3: Handle 422 "Email has already been taken" by searching again
      if (createError?.status === 422 && createPayload.email?.trim()) {
        console.warn(
          `[ContactResolutionService] Contact creation failed with 422, attempting to find existing contact by email`
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

            console.log(
              `[ContactResolutionService] Successfully recovered by finding existing contact ID: ${exactMatch.id}`
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

  /**
   * Sync Chatwoot contact with latest GoMake data
   * Compares current contact data with GoMake data and updates if changed
   *
   * @param accountId - Chatwoot account ID
   * @param chatwootContactId - Chatwoot contact ID to update
   * @param gomakeContact - GoMake contact data
   * @returns Updated ContactDetail
   */
  async syncContactWithGomakeData(
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
          `[ContactResolutionService] Contact data changed for Chatwoot ID ${chatwootContactId}, updating...`,
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

        console.log(`[ContactResolutionService] Contact ${chatwootContactId} synced successfully`);
        return updatedContact;
      } else {
        console.log(
          `[ContactResolutionService] Contact data unchanged for Chatwoot ID ${chatwootContactId}, skipping sync`
        );
        return currentContact;
      }
    } catch (error) {
      console.error(`[ContactResolutionService] Failed to sync contact: ${error}`);
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
   * Resolve Chatwoot contact from GoMake customer data
   *
   * This method:
   * 1. Searches GoMake CRM for customer and contacts
   * 2. Searches/creates Chatwoot contact with gomake_contact_id
   * 3. Syncs contact data if already exists
   *
   * @param accountId - Chatwoot account ID
   * @param gomakeApi - GoMake API client
   * @param options - Contact resolution options
   * @returns Chatwoot ContactDetail or null
   */
  async resolveContactFromGomakeCustomer(
    accountId: number,
    gomakeApi: GomakeApiClient,
    options: ResolveContactOptions
  ): Promise<ContactDetail | null> {
    const { customerId, contactEmail, contactName, contactPhone } = options;

    if (!customerId && !contactEmail) {
      console.warn("[ContactResolutionService] No customer ID or contact email provided");
      return null;
    }

    try {
      let chatwootContact: ContactDetail | null = null;

      // Step 1: Search GoMake customer by customerId to get contacts
      if (customerId) {
        try {
          const customerResult = await gomakeApi.callApi(
            "GET",
            "/v1/customers/get-customers-pagination",
            {
              clientType: "C",
              pageNumber: 1,
              pageSize: 1,
              id: customerId,
              isActive: true,
            },
            false
          );

          if (customerResult?.data?.data?.data?.length > 0) {
            const customer = customerResult.data.data.data[0];

            // Get customer contacts from GoMake CRM
            const contactsResponse = await gomakeApi.callApi(
              "GET",
              "/v1/crm-service/customer/get-client-contacts",
              { ClientId: customerId },
              false
            );

            let contactsArray: any[] = [];

            // Handle different response formats
            if (contactsResponse?.data?.data?.data && Array.isArray(contactsResponse.data.data.data)) {
              contactsArray = contactsResponse.data.data.data;
            } else if (contactsResponse?.data?.data && Array.isArray(contactsResponse.data.data)) {
              contactsArray = contactsResponse.data.data;
            } else if (contactsResponse?.data && Array.isArray(contactsResponse.data)) {
              contactsArray = contactsResponse.data;
            } else if (Array.isArray(contactsResponse)) {
              contactsArray = contactsResponse;
            }

            // Find matching contact by email or use first contact
            let selectedContact = contactsArray.find(
              (c: any) => (c.mail || c.email)?.toLowerCase() === contactEmail?.toLowerCase()
            ) || contactsArray[0] || null;

            // If no contact found but customer has email/phone, create fallback contact
            if (!selectedContact && (customer.mail || customer.phone)) {
              selectedContact = {
                id: undefined,
                name: customer.name || contactName || "",
                mail: customer.mail || contactEmail || "",
                phone: customer.phone || contactPhone || "",
              };
            }

            if (selectedContact) {
              const gomakeContact: GomakeContact = {
                id: undefined,
                name: selectedContact.name || contactName || customer.name || "",
                email: selectedContact.mail || selectedContact.email || contactEmail || customer.mail || "",
                phone_number: selectedContact.phone || selectedContact.phone_number || contactPhone || customer.phone || "",
                gomake_contact_id: selectedContact.id || selectedContact._id,
                gomake_customer_id: customerId,
                gomake_customer_name: customer.name || "",
                gomake_client_code: customer.code || customer.customerCode || "",
                gomake_agent_id: customer.agentId || customer.agent_id || "",
                gomake_is_main_contact: selectedContact.isMainContact || selectedContact.is_main_contact || true,
              };

              // Step 2: Search Chatwoot for contact with gomake_contact_id (if available)
              if (gomakeContact.gomake_contact_id) {
                const filters = [
                  {
                    attribute_key: "gomake_contact_id",
                    filter_operator: "equal_to",
                    values: [gomakeContact.gomake_contact_id],
                    attribute_model: "standard",
                  },
                ];

                const filterResponse = await chatwootService.contacts.filterContacts(
                  accountId,
                  { payload: filters },
                  {
                    include_contact_inboxes: false,
                    page: 1,
                    sort: "name",
                  }
                );

                const foundContacts = filterResponse.payload || [];

                if (foundContacts.length === 1) {
                  // Found existing contact - sync with latest GoMake data
                  const foundContact = foundContacts[0];
                  console.log(
                    `[ContactResolutionService] Found existing contact in Chatwoot (ID: ${foundContact.id}), syncing with GoMake data...`
                  );

                  chatwootContact = await this.syncContactWithGomakeData(
                    accountId,
                    foundContact.id!,
                    gomakeContact
                  );
                } else if (foundContacts.length === 0) {
                  // Not found, create new contact
                  const createPayload: ContactCreatePayload = {
                    name: gomakeContact.name,
                    email: gomakeContact.email || undefined,
                    phone_number: gomakeContact.phone_number || undefined,
                    custom_attributes: {
                      gomake_contact_id: gomakeContact.gomake_contact_id,
                      gomake_customer_id: gomakeContact.gomake_customer_id,
                      gomake_client_code: gomakeContact.gomake_client_code,
                      gomake_agent_id: gomakeContact.gomake_agent_id,
                      gomake_is_main_contact: gomakeContact.gomake_is_main_contact,
                    },
                  };

                  console.log(
                    `[ContactResolutionService] Creating new contact with gomake_contact_id ${gomakeContact.gomake_contact_id}`
                  );
                  chatwootContact = await this.findOrCreateContact(accountId, createPayload);
                } else {
                  // Multiple found - use first one and sync
                  console.warn(
                    `[ContactResolutionService] Multiple contacts found with gomake_contact_id ${gomakeContact.gomake_contact_id}, using first one and syncing`
                  );
                  const foundContact = foundContacts[0];
                  chatwootContact = await this.syncContactWithGomakeData(
                    accountId,
                    foundContact.id!,
                    gomakeContact
                  );
                }
              } else {
                // No gomake_contact_id, use find-or-create pattern
                const createPayload: ContactCreatePayload = {
                  name: gomakeContact.name,
                  email: gomakeContact.email || undefined,
                  phone_number: gomakeContact.phone_number || undefined,
                  custom_attributes: {
                    gomake_customer_id: gomakeContact.gomake_customer_id,
                    gomake_client_code: gomakeContact.gomake_client_code,
                    gomake_agent_id: gomakeContact.gomake_agent_id,
                    gomake_is_main_contact: gomakeContact.gomake_is_main_contact,
                  },
                };

                console.log(
                  `[ContactResolutionService] Creating new contact without gomake_contact_id`
                );
                chatwootContact = await this.findOrCreateContact(accountId, createPayload);
              }
            }
          }
        } catch (error) {
          console.error("[ContactResolutionService] Failed to fetch GoMake customer:", error);
        }
      }

      // Step 3: Fallback - if no customer found, try to create contact from email/phone
      if (!chatwootContact && contactEmail) {
        const createPayload: ContactCreatePayload = {
          name: contactName || contactEmail,
          email: contactEmail,
          phone_number: contactPhone || undefined,
        };

        console.log(
          `[ContactResolutionService] Creating fallback contact from email ${contactEmail}`
        );
        chatwootContact = await this.findOrCreateContact(accountId, createPayload);
      }

      return chatwootContact;
    } catch (error) {
      console.error("[ContactResolutionService] Failed to resolve contact:", error);
      return null;
    }
  }
}

// Export singleton instance
export const contactResolutionService = new ContactResolutionService();
