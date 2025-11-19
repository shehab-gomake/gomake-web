# ConversationsAPIApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAConversation**](#createaconversation) | **POST** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations | Create a conversation|
|[**getSingleConversation**](#getsingleconversation) | **GET** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations/{conversation_id} | Get a single conversation|
|[**listAllContactConversations**](#listallcontactconversations) | **GET** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations | List all conversations|
|[**resolveConversation**](#resolveconversation) | **POST** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations/{conversation_id}/toggle_status | Resolve a conversation|
|[**toggleTypingStatus**](#toggletypingstatus) | **POST** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations/{conversation_id}/toggle_typing | Toggle typing status|
|[**updateLastSeen**](#updatelastseen) | **POST** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations/{conversation_id}/update_last_seen | Update last seen|

# **createAConversation**
> PublicConversation createAConversation(publicConversationCreatePayload)

Create a conversation

### Example

```typescript
import {
    ConversationsAPIApi,
    Configuration,
    PublicConversationCreatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let publicConversationCreatePayload: PublicConversationCreatePayload; //

const { status, data } = await apiInstance.createAConversation(
    inboxIdentifier,
    contactIdentifier,
    publicConversationCreatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **publicConversationCreatePayload** | **PublicConversationCreatePayload**|  | |
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|
| **contactIdentifier** | [**string**] | The source id of contact obtained on contact create | defaults to undefined|


### Return type

**PublicConversation**

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

# **getSingleConversation**
> PublicConversation getSingleConversation()

Retrieves the details of a specific conversation

### Example

```typescript
import {
    ConversationsAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)

const { status, data } = await apiInstance.getSingleConversation(
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

**PublicConversation**

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
|**404** | Conversation not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllContactConversations**
> Array<PublicConversation> listAllContactConversations()

List all conversations for the contact

### Example

```typescript
import {
    ConversationsAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)

const { status, data } = await apiInstance.listAllContactConversations(
    inboxIdentifier,
    contactIdentifier
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|
| **contactIdentifier** | [**string**] | The source id of contact obtained on contact create | defaults to undefined|


### Return type

**Array<PublicConversation>**

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

# **resolveConversation**
> PublicConversation resolveConversation()

Marks a conversation as resolved

### Example

```typescript
import {
    ConversationsAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)

const { status, data } = await apiInstance.resolveConversation(
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

**PublicConversation**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Conversation resolved successfully |  -  |
|**401** | Unauthorized |  -  |
|**404** | Conversation not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **toggleTypingStatus**
> toggleTypingStatus(toggleTypingStatusRequest)

Toggles the typing status in a conversation

### Example

```typescript
import {
    ConversationsAPIApi,
    Configuration,
    ToggleTypingStatusRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let typingStatus: string; //Typing status, either \'on\' or \'off\' (default to undefined)
let toggleTypingStatusRequest: ToggleTypingStatusRequest; //

const { status, data } = await apiInstance.toggleTypingStatus(
    inboxIdentifier,
    contactIdentifier,
    conversationId,
    typingStatus,
    toggleTypingStatusRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **toggleTypingStatusRequest** | **ToggleTypingStatusRequest**|  | |
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|
| **contactIdentifier** | [**string**] | The source id of contact obtained on contact create | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|
| **typingStatus** | [**string**] | Typing status, either \&#39;on\&#39; or \&#39;off\&#39; | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Typing status toggled successfully |  -  |
|**401** | Unauthorized |  -  |
|**404** | Conversation not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateLastSeen**
> updateLastSeen()

Updates the last seen time of the contact in a conversation

### Example

```typescript
import {
    ConversationsAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)

const { status, data } = await apiInstance.updateLastSeen(
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

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Last seen updated successfully |  -  |
|**401** | Unauthorized |  -  |
|**404** | Conversation not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

