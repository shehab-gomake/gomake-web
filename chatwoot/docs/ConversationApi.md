# ConversationApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getConversationMessages**](#getconversationmessages) | **GET** /accounts/{account_id}/conversations/{conversation_id}/messages | Get messages from a conversation|

# **getConversationMessages**
> ConversationMessages getConversationMessages()

Returns all messages from a specific conversation

### Example

```typescript
import {
    ConversationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //ID of the conversation (default to undefined)

const { status, data } = await apiInstance.getConversationMessages(
    accountId,
    conversationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | ID of the conversation | defaults to undefined|


### Return type

**ConversationMessages**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

