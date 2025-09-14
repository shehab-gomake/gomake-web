import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

// Placeholder endpoints to match the project's API pattern. Adjust URLs once backend is ready.
const GET_GMAIL_INBOX_URL = "/v1/frontdesk-service/gmail/inbox"; // supports ?limit=

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

export { getGmailInboxApi };

