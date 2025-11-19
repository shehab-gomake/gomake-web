# ConversationAssignmentsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignAConversation**](#assignaconversation) | **POST** /api/v1/accounts/{account_id}/conversations/{conversation_id}/assignments | Assign Conversation|

# **assignAConversation**
> User assignAConversation(assignAConversationRequest)

Assign a conversation to an agent or a team

### Example

```typescript
import {
    ConversationAssignmentsApi,
    Configuration,
    AssignAConversationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationAssignmentsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let assignAConversationRequest: AssignAConversationRequest; //

const { status, data } = await apiInstance.assignAConversation(
    accountId,
    conversationId,
    assignAConversationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignAConversationRequest** | **AssignAConversationRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

**User**

### Authorization

[userApiKey](../README.md#userApiKey), [agentBotApiKey](../README.md#agentBotApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |
|**404** | Conversation not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

