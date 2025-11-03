# MessagesAPIApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAMessage**](#createamessage) | **POST** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations/{conversation_id}/messages | Create a message|
|[**listAllConverationMessages**](#listallconverationmessages) | **GET** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations/{conversation_id}/messages | List all messages|
|[**updateAMessage**](#updateamessage) | **PATCH** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations/{conversation_id}/messages/{message_id} | Update a message|

# **createAMessage**
> PublicMessage createAMessage(publicMessageCreatePayload)

Create a message

### Example

```typescript
import {
    MessagesAPIApi,
    Configuration,
    PublicMessageCreatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let publicMessageCreatePayload: PublicMessageCreatePayload; //

const { status, data } = await apiInstance.createAMessage(
    inboxIdentifier,
    contactIdentifier,
    conversationId,
    publicMessageCreatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **publicMessageCreatePayload** | **PublicMessageCreatePayload**|  | |
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|
| **contactIdentifier** | [**string**] | The source id of contact obtained on contact create | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

**PublicMessage**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllConverationMessages**
> Array<PublicMessage> listAllConverationMessages()

List all messages in the conversation

### Example

```typescript
import {
    MessagesAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)

const { status, data } = await apiInstance.listAllConverationMessages(
    inboxIdentifier,
    contactIdentifier,
    conversationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|
| **contactIdentifier** | [**string**] | The source id of contact obtained on contact create | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

**Array<PublicMessage>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAMessage**
> PublicMessage updateAMessage(publicMessageUpdatePayload)

Update a message

### Example

```typescript
import {
    MessagesAPIApi,
    Configuration,
    PublicMessageUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let messageId: number; //The numeric ID of the message (default to undefined)
let publicMessageUpdatePayload: PublicMessageUpdatePayload; //

const { status, data } = await apiInstance.updateAMessage(
    inboxIdentifier,
    contactIdentifier,
    conversationId,
    messageId,
    publicMessageUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **publicMessageUpdatePayload** | **PublicMessageUpdatePayload**|  | |
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|
| **contactIdentifier** | [**string**] | The source id of contact obtained on contact create | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|
| **messageId** | [**number**] | The numeric ID of the message | defaults to undefined|


### Return type

**PublicMessage**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

