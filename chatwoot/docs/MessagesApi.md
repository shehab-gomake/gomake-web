# MessagesApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createANewMessageInAConversation**](#createanewmessageinaconversation) | **POST** /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages | Create New Message|
|[**deleteAMessage**](#deleteamessage) | **DELETE** /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages/{message_id} | Delete a message|
|[**listAllMessages**](#listallmessages) | **GET** /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages | Get messages|

# **createANewMessageInAConversation**
> CreateANewMessageInAConversation200Response createANewMessageInAConversation(conversationMessageCreatePayload)

Create a new message in the conversation.  ## WhatsApp Template Messages  For WhatsApp channels, you can send structured template messages using the `template_params` field.  Templates must be pre-approved in WhatsApp Business Manager.  ### Example Templates  **Text with Image Header:** ```json {   \"content\": \"Hi your order 121212 is confirmed. Please wait for further updates\",   \"template_params\": {     \"name\": \"order_confirmation\",     \"category\": \"MARKETING\",     \"language\": \"en\",     \"processed_params\": {       \"body\": {         \"1\": \"121212\"       },       \"header\": {         \"media_url\": \"https://picsum.photos/200/300\",         \"media_type\": \"image\"       }     }   } } ```  **Text with Copy Code Button:** ```json {   \"content\": \"Special offer! Get 30% off your next purchase. Use the code below\",   \"template_params\": {     \"name\": \"discount_coupon\",     \"category\": \"MARKETING\",     \"language\": \"en\",     \"processed_params\": {       \"body\": {         \"discount_percentage\": \"30\"       },       \"buttons\": [{         \"type\": \"copy_code\",         \"parameter\": \"SAVE20\"       }]     }   } } ``` 

### Example

```typescript
import {
    MessagesApi,
    Configuration,
    ConversationMessageCreatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let conversationMessageCreatePayload: ConversationMessageCreatePayload; //

const { status, data } = await apiInstance.createANewMessageInAConversation(
    accountId,
    conversationId,
    conversationMessageCreatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationMessageCreatePayload** | **ConversationMessageCreatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

**CreateANewMessageInAConversation200Response**

### Authorization

[userApiKey](../README.md#userApiKey), [agentBotApiKey](../README.md#agentBotApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Conversation not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAMessage**
> deleteAMessage()

Delete a message and it\'s attachments from the conversation.

### Example

```typescript
import {
    MessagesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let messageId: number; //The numeric ID of the message (default to undefined)

const { status, data } = await apiInstance.deleteAMessage(
    accountId,
    conversationId,
    messageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|
| **messageId** | [**number**] | The numeric ID of the message | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |
|**404** | The message or conversation does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllMessages**
> ListAllMessages200Response listAllMessages()

List all messages of a conversation

### Example

```typescript
import {
    MessagesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)

const { status, data } = await apiInstance.listAllMessages(
    accountId,
    conversationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

**ListAllMessages200Response**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Conversation not found |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

