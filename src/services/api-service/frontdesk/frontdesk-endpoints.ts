import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

// Existing Gmail endpoints
const GET_GMAIL_INBOX_URL = "/v1/frontdesk-service/gmail/inbox";
const GET_GMAIL_CONVERSATIONS_URL = "/api/gmail/conversations";
const GET_CHANNEL_MESSAGES_URL = "/messages/channel";

// Direct Messages & Group Conversations endpoints
const DMS_BASE_URL = "/api/dms";

// Channels endpoints
const CHANNELS_BASE_URL = "/api/channels";

// Ticketing System endpoints
const TICKETS_BASE_URL = "/api/tickets";

// ============================================
// Gmail APIs (Existing)
// ============================================

const getGmailInboxApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  const limit = data?.limit ? `?limit=${encodeURIComponent(data.limit)}` : "";
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_GMAIL_INBOX_URL}${limit}`,
    setState
  );
};

const getGmailConversationsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  const nextPageToken = data?.nextPageToken ? `?nextPageToken=${encodeURIComponent(data.nextPageToken)}` : "";
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_GMAIL_CONVERSATIONS_URL}${nextPageToken}`,
    setState
  );
};

const getChannelMessagesApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  const { channelId, limit = 50, offset = 0 } = data || {};
  if (!channelId) {
    throw new Error('channelId is required');
  }

  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const queryString = params.toString() ? `?${params.toString()}` : '';

  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_CHANNEL_MESSAGES_URL}/${encodeURIComponent(channelId)}${queryString}`,
    setState
  );
};

// ============================================
// Direct Messages & Group Conversations APIs
// ============================================

// Create a new conversation (1-on-1 or group DM)
const createConversationApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.participantIds || !Array.isArray(data.participantIds) || data.participantIds.length === 0) {
    throw new Error('participantIds array is required and cannot be empty');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DMS_BASE_URL,
    setState,
    {
      participantIds: data.participantIds,
      name: data.name // Optional for group conversations
    }
  );
};

// Get all conversations for the current user
const getConversationsApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    DMS_BASE_URL,
    setState
  );
};

// Get a single conversation by ID
const getConversationByIdApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.conversationId) {
    throw new Error('conversationId is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${DMS_BASE_URL}/${encodeURIComponent(data.conversationId)}`,
    setState
  );
};

// Get messages for a conversation
const getConversationMessagesApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.conversationId) {
    throw new Error('conversationId is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${DMS_BASE_URL}/${encodeURIComponent(data.conversationId)}/messages`,
    setState
  );
};

// ============================================
// Channels APIs
// ============================================

// Create a new channel
const createChannelApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.name) {
    throw new Error('Channel name is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CHANNELS_BASE_URL,
    setState,
    {
      name: data.name,
      description: data.description || '',
      isPublic: data.isPublic !== undefined ? data.isPublic : true
    }
  );
};

// Get all channels (public and user's private channels)
const getChannelsApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    CHANNELS_BASE_URL,
    setState
  );
};

// Get a single channel by ID
const getChannelByIdApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.channelId) {
    throw new Error('channelId is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${CHANNELS_BASE_URL}/${encodeURIComponent(data.channelId)}`,
    setState
  );
};

// Get channel members
const getChannelMembersApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.channelId) {
    throw new Error('channelId is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${CHANNELS_BASE_URL}/${encodeURIComponent(data.channelId)}/members`,
    setState
  );
};

// Join a channel
const joinChannelApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.channelId) {
    throw new Error('channelId is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${CHANNELS_BASE_URL}/${encodeURIComponent(data.channelId)}/join`,
    setState
  );
};

// Leave a channel
const leaveChannelApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.channelId) {
    throw new Error('channelId is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${CHANNELS_BASE_URL}/${encodeURIComponent(data.channelId)}/leave`,
    setState
  );
};

// ============================================
// Ticketing System APIs
// ============================================

// List tickets with filtering
const getTicketsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  const queryParams = new URLSearchParams();

  if (data?.status) queryParams.append('status', data.status);
  if (data?.priority) queryParams.append('priority', data.priority);
  if (data?.assigneeId) queryParams.append('assigneeId', data.assigneeId);
  if (data?.managerId) queryParams.append('managerId', data.managerId);
  if (data?.categoryId) queryParams.append('categoryId', data.categoryId);
  if (data?.customerEmail) queryParams.append('customerEmail', data.customerEmail);
  if (data?.customerPhone) queryParams.append('customerPhone', data.customerPhone);
  if (data?.tags) queryParams.append('tags', data.tags.join(','));
  if (data?.page) queryParams.append('page', data.page.toString());
  if (data?.limit) queryParams.append('limit', data.limit.toString());
  if (data?.sortBy) queryParams.append('sortBy', data.sortBy);
  if (data?.sortOrder) queryParams.append('sortOrder', data.sortOrder);

  const queryString = queryParams.toString();
  const url = queryString ? `${TICKETS_BASE_URL}?${queryString}` : TICKETS_BASE_URL;

  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    url,
    setState
  );
};

// Assign ticket to agent
const assignTicketApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId || !data?.assigneeId) {
    throw new Error('ticketId and assigneeId are required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/assign`,
    setState,
    { assigneeId: data.assigneeId }
  );
};

// Reply to ticket
const replyToTicketApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId || !data?.content) {
    throw new Error('ticketId and content are required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/reply`,
    setState,
    { content: data.content }
  );
};

// Update ticket status
const updateTicketStatusApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId || !data?.status) {
    throw new Error('ticketId and status are required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.PATCH,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/status`,
    setState,
    { status: data.status }
  );
};

// Update ticket priority
const updateTicketPriorityApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId || !data?.priority) {
    throw new Error('ticketId and priority are required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.PATCH,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/priority`,
    setState,
    { priority: data.priority }
  );
};

// Add note to ticket
const addTicketNoteApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId || !data?.note) {
    throw new Error('ticketId and note are required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/notes`,
    setState,
    { note: data.note }
  );
};

// Add tag to ticket
const addTicketTagApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId || !data?.tag) {
    throw new Error('ticketId and tag are required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/tags`,
    setState,
    { tag: data.tag }
  );
};

// Remove tag from ticket
const removeTicketTagApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId || !data?.tag) {
    throw new Error('ticketId and tag are required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/tags/${encodeURIComponent(data.tag)}`,
    setState
  );
};

// Merge tickets
const mergeTicketsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.sourceTicketId || !data?.targetTicketId) {
    throw new Error('sourceTicketId and targetTicketId are required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.sourceTicketId)}/merge`,
    setState,
    { targetTicketId: data.targetTicketId }
  );
};

// Reopen ticket (Manager only)
const reopenTicketApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId) {
    throw new Error('ticketId is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/reopen`,
    setState
  );
};

// Get available agents for ticket assignment
const getAvailableAgentsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${TICKETS_BASE_URL}/agents`,
    setState
  );
};

// Get ticket categories
const getTicketCategoriesApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${TICKETS_BASE_URL}/categories`,
    setState
  );
};

// Get ticket history
const getTicketHistoryApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  if (!data?.ticketId) {
    throw new Error('ticketId is required');
  }

  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${TICKETS_BASE_URL}/${encodeURIComponent(data.ticketId)}/history`,
    setState
  );
};

// Export all API functions
export {
  // Gmail APIs
  getGmailInboxApi,
  getGmailConversationsApi,
  getChannelMessagesApi,

  // Direct Messages APIs
  createConversationApi,
  getConversationsApi,
  getConversationByIdApi,
  getConversationMessagesApi,

  // Channels APIs
  createChannelApi,
  getChannelsApi,
  getChannelByIdApi,
  getChannelMembersApi,
  joinChannelApi,
  leaveChannelApi,

  // Ticketing APIs
  getTicketsApi,
  assignTicketApi,
  replyToTicketApi,
  updateTicketStatusApi,
  updateTicketPriorityApi,
  addTicketNoteApi,
  addTicketTagApi,
  removeTicketTagApi,
  mergeTicketsApi,
  reopenTicketApi,
  getAvailableAgentsApi,
  getTicketCategoriesApi,
  getTicketHistoryApi
};