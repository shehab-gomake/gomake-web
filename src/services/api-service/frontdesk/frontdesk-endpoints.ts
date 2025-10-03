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
  leaveChannelApi
};