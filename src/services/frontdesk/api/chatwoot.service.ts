/**
 * Chatwoot Service Layer
 * Phase 1: Foundational Setup - New API Service for testing Chatwoot backend
 *
 * This file provides a singleton instance of the Chatwoot API client
 * for testing purposes.
 */

import { Configuration, ConversationsApi, MessagesApi, ContactsApi, InboxesApi } from "@/chatwoot";
import { getUserToken } from "@/services/storage-data";

// Create configuration with authentication
const createChatwootConfig = (): Configuration => {
  const token = getUserToken();

  return new Configuration({
    basePath: "http://localhost:8080",
    baseOptions: {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  });
};

// Singleton instances
let conversationsApiInstance: ConversationsApi | null = null;
let messagesApiInstance: MessagesApi | null = null;
let contactsApiInstance: ContactsApi | null = null;
let inboxesApiInstance: InboxesApi | null = null;

/**
 * Get or create ConversationsApi instance
 */
export const getChatwootConversationsApi = (): ConversationsApi => {
  if (!conversationsApiInstance) {
    const config = createChatwootConfig();
    conversationsApiInstance = new ConversationsApi(config);
  }
  return conversationsApiInstance;
};

/**
 * Get or create MessagesApi instance
 */
export const getChatwootMessagesApi = (): MessagesApi => {
  if (!messagesApiInstance) {
    const config = createChatwootConfig();
    messagesApiInstance = new MessagesApi(config);
  }
  return messagesApiInstance;
};

/**
 * Get or create ContactsApi instance
 */
export const getChatwootContactsApi = (): ContactsApi => {
  if (!contactsApiInstance) {
    const config = createChatwootConfig();
    contactsApiInstance = new ContactsApi(config);
  }
  return contactsApiInstance;
};

/**
 * Get or create InboxesApi instance
 */
export const getChatwootInboxesApi = (): InboxesApi => {
  if (!inboxesApiInstance) {
    const config = createChatwootConfig();
    inboxesApiInstance = new InboxesApi(config);
  }
  return inboxesApiInstance;
};

/**
 * Reset all API instances (useful for testing or auth changes)
 */
export const resetChatwootApiInstances = (): void => {
  conversationsApiInstance = null;
  messagesApiInstance = null;
  contactsApiInstance = null;
  inboxesApiInstance = null;
};

// Export convenient direct instances (will be created on first access)
export const chatwootConversationsApi = getChatwootConversationsApi();
export const chatwootMessagesApi = getChatwootMessagesApi();
export const chatwootContactsApi = getChatwootContactsApi();
export const chatwootInboxesApi = getChatwootInboxesApi();
