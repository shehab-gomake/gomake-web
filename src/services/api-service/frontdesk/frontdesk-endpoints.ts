import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

// Placeholder endpoints to match the project's API pattern. Adjust URLs once backend is ready.
const GET_GMAIL_INBOX_URL = "/v1/frontdesk-service/gmail/inbox"; // supports ?limit=
const GET_GMAIL_CONVERSATIONS_URL = "/api/gmail/conversations"; // proxy to messaging service
const GET_CHANNEL_MESSAGES_URL = "/messages/channel"; // for fetching channel message history

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

export { getGmailInboxApi, getGmailConversationsApi, getChannelMessagesApi };
