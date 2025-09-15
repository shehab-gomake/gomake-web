import { getUserToken } from "@/services/storage-data";

// Base URL for messaging service (default to localhost:3000)
const BASE_URL = (process.env.NEXT_PUBLIC_MESSAGING_SERVICE_URL || "http://localhost:3000").replace(/\/$/, "");

// Gmail API endpoints - direct to messaging service
const GMAIL_PROFILE_URL = `${BASE_URL}/api/gmail/profile`;
const GMAIL_AUTH_URL = `${BASE_URL}/api/gmail/auth-url`;
const GMAIL_CONVERSATIONS_URL = `${BASE_URL}/api/gmail/conversations`;
const GMAIL_CONVERSATION_DETAIL_URL = `${BASE_URL}/api/gmail/conversations`;
const GMAIL_SEND_URL = `${BASE_URL}/api/gmail/send`;
const GMAIL_DISCONNECT_URL = `${BASE_URL}/api/gmail/disconnect`;

// Helper function for Gmail API calls
const gmailFetch = async (url: string, options: RequestInit = {}) => {
  const userToken = getUserToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(userToken && { Authorization: `Bearer ${userToken}` }),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Check Gmail connection status
const getGmailProfile = async () => {
  return gmailFetch(GMAIL_PROFILE_URL);
};

// Get Gmail OAuth authorization URL
const getGmailAuthUrl = async () => {
  return gmailFetch(GMAIL_AUTH_URL);
};

// Get Gmail conversations list with pagination
const getGmailConversations = async (data: { limit?: number; pageToken?: string } = {}) => {
  const { limit = 20, pageToken } = data;
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    ...(pageToken && { pageToken }),
  });

  return gmailFetch(`${GMAIL_CONVERSATIONS_URL}?${queryParams}`);
};

// Get single Gmail conversation details
const getGmailConversationDetail = async (conversationId: string) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  return gmailFetch(`${GMAIL_CONVERSATION_DETAIL_URL}/${conversationId}`);
};

// Send Gmail message (new email or reply)
const sendGmailMessage = async (data: {
  to: string;
  subject?: string;
  text: string;
  replyToMessageId?: string;
}) => {
  const { to, subject, text, replyToMessageId } = data;

  if (!to || !text) {
    throw new Error("To and text fields are required");
  }

  const messageData = {
    to,
    subject: subject || "No Subject",
    text,
    ...(replyToMessageId && { replyToMessageId }),
  };

  return gmailFetch(GMAIL_SEND_URL, {
    method: "POST",
    body: JSON.stringify(messageData),
  });
};

// Disconnect Gmail account
const disconnectGmail = async () => {
  return gmailFetch(GMAIL_DISCONNECT_URL, {
    method: "POST",
    body: JSON.stringify({}),
  });
};

export {
  getGmailProfile,
  getGmailAuthUrl,
  getGmailConversations,
  getGmailConversationDetail,
  sendGmailMessage,
  disconnectGmail,
};
