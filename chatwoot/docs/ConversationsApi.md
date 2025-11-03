# ConversationsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**conversationAddLabels**](#conversationaddlabels) | **POST** /api/v1/accounts/{account_id}/conversations/{conversation_id}/labels | Add Labels|
|[**conversationFilter**](#conversationfilter) | **POST** /api/v1/accounts/{account_id}/conversations/filter | Conversations Filter|
|[**conversationList**](#conversationlist) | **GET** /api/v1/accounts/{account_id}/conversations | Conversations List|
|[**conversationListMeta**](#conversationlistmeta) | **GET** /api/v1/accounts/{account_id}/conversations/meta | Get Conversation Counts|
|[**getDetailsOfAConversation**](#getdetailsofaconversation) | **GET** /api/v1/accounts/{account_id}/conversations/{conversation_id} | Conversation Details|
|[**listAllLabelsOfAConversation**](#listalllabelsofaconversation) | **GET** /api/v1/accounts/{account_id}/conversations/{conversation_id}/labels | List Labels|
|[**newConversation**](#newconversation) | **POST** /api/v1/accounts/{account_id}/conversations | Create New Conversation|
|[**togglePriorityOfAConversation**](#togglepriorityofaconversation) | **POST** /api/v1/accounts/{account_id}/conversations/{conversation_id}/toggle_priority | Toggle Priority|
|[**toggleStatusOfAConversation**](#togglestatusofaconversation) | **POST** /api/v1/accounts/{account_id}/conversations/{conversation_id}/toggle_status | Toggle Status|
|[**updateConversation**](#updateconversation) | **PATCH** /api/v1/accounts/{account_id}/conversations/{conversation_id} | Update Conversation|
|[**updateCustomAttributesOfAConversation**](#updatecustomattributesofaconversation) | **POST** /api/v1/accounts/{account_id}/conversations/{conversation_id}/custom_attributes | Update Custom Attributes|

# **conversationAddLabels**
> ConversationLabels conversationAddLabels(contactAddLabelsRequest)

Add labels to a conversation. Note that this API would overwrite the existing list of labels associated to the conversation.

### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ContactAddLabelsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let contactAddLabelsRequest: ContactAddLabelsRequest; //

const { status, data } = await apiInstance.conversationAddLabels(
    accountId,
    conversationId,
    contactAddLabelsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contactAddLabelsRequest** | **ContactAddLabelsRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

**ConversationLabels**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Conversation not found |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **conversationFilter**
> ConversationList conversationFilter(conversationFilterRequest)

Filter conversations with custom filter options and pagination

### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ConversationFilterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationFilterRequest: ConversationFilterRequest; //
let page: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.conversationFilter(
    accountId,
    conversationFilterRequest,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationFilterRequest** | **ConversationFilterRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ConversationList**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Bad Request Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **conversationList**
> ConversationList conversationList()

List all the conversations with pagination

### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let assigneeType: 'me' | 'unassigned' | 'all' | 'assigned'; //Filter conversations by assignee type. (optional) (default to 'all')
let status: 'all' | 'open' | 'resolved' | 'pending' | 'snoozed'; //Filter by conversation status. (optional) (default to 'open')
let q: string; //Filters conversations with messages containing the search term (optional) (default to undefined)
let inboxId: number; // (optional) (default to undefined)
let teamId: number; // (optional) (default to undefined)
let labels: Array<string>; // (optional) (default to undefined)
let page: number; //paginate through conversations (optional) (default to 1)

const { status, data } = await apiInstance.conversationList(
    accountId,
    assigneeType,
    status,
    q,
    inboxId,
    teamId,
    labels,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **assigneeType** | [**&#39;me&#39; | &#39;unassigned&#39; | &#39;all&#39; | &#39;assigned&#39;**]**Array<&#39;me&#39; &#124; &#39;unassigned&#39; &#124; &#39;all&#39; &#124; &#39;assigned&#39;>** | Filter conversations by assignee type. | (optional) defaults to 'all'|
| **status** | [**&#39;all&#39; | &#39;open&#39; | &#39;resolved&#39; | &#39;pending&#39; | &#39;snoozed&#39;**]**Array<&#39;all&#39; &#124; &#39;open&#39; &#124; &#39;resolved&#39; &#124; &#39;pending&#39; &#124; &#39;snoozed&#39;>** | Filter by conversation status. | (optional) defaults to 'open'|
| **q** | [**string**] | Filters conversations with messages containing the search term | (optional) defaults to undefined|
| **inboxId** | [**number**] |  | (optional) defaults to undefined|
| **teamId** | [**number**] |  | (optional) defaults to undefined|
| **labels** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|
| **page** | [**number**] | paginate through conversations | (optional) defaults to 1|


### Return type

**ConversationList**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Bad Request Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **conversationListMeta**
> ConversationListMeta200Response conversationListMeta()

Get open, unassigned and all Conversation counts

### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let status: 'all' | 'open' | 'resolved' | 'pending' | 'snoozed'; //Filter by conversation status. (optional) (default to 'open')
let q: string; //Filters conversations with messages containing the search term (optional) (default to undefined)
let inboxId: number; // (optional) (default to undefined)
let teamId: number; // (optional) (default to undefined)
let labels: Array<string>; // (optional) (default to undefined)

const { status, data } = await apiInstance.conversationListMeta(
    accountId,
    status,
    q,
    inboxId,
    teamId,
    labels
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **status** | [**&#39;all&#39; | &#39;open&#39; | &#39;resolved&#39; | &#39;pending&#39; | &#39;snoozed&#39;**]**Array<&#39;all&#39; &#124; &#39;open&#39; &#124; &#39;resolved&#39; &#124; &#39;pending&#39; &#124; &#39;snoozed&#39;>** | Filter by conversation status. | (optional) defaults to 'open'|
| **q** | [**string**] | Filters conversations with messages containing the search term | (optional) defaults to undefined|
| **inboxId** | [**number**] |  | (optional) defaults to undefined|
| **teamId** | [**number**] |  | (optional) defaults to undefined|
| **labels** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|


### Return type

**ConversationListMeta200Response**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Bad Request Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfAConversation**
> ConversationShow getDetailsOfAConversation()

Get all details regarding a conversation with all messages in the conversation

### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)

const { status, data } = await apiInstance.getDetailsOfAConversation(
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

**ConversationShow**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**403** | Access denied |  -  |
|**404** | Conversation not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllLabelsOfAConversation**
> ConversationLabels listAllLabelsOfAConversation()

Lists all the labels of a conversation

### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)

const { status, data } = await apiInstance.listAllLabelsOfAConversation(
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

**ConversationLabels**

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

# **newConversation**
> NewConversation200Response newConversation(conversationCreatePayload)

Creating a conversation in chatwoot requires a source id.    Learn more about source_id: https://www.chatwoot.com/hc/user-guide/articles/1677839703-how-to-create-an-api-channel-inbox#send-messages-to-the-api-channel

### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ConversationCreatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationCreatePayload: ConversationCreatePayload; //

const { status, data } = await apiInstance.newConversation(
    accountId,
    conversationCreatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationCreatePayload** | **ConversationCreatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**NewConversation200Response**

### Authorization

[userApiKey](../README.md#userApiKey), [agentBotApiKey](../README.md#agentBotApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **togglePriorityOfAConversation**
> togglePriorityOfAConversation(togglePriorityOfAConversationRequest)

Toggles the priority of conversation

### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    TogglePriorityOfAConversationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let togglePriorityOfAConversationRequest: TogglePriorityOfAConversationRequest; //

const { status, data } = await apiInstance.togglePriorityOfAConversation(
    accountId,
    conversationId,
    togglePriorityOfAConversationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **togglePriorityOfAConversationRequest** | **TogglePriorityOfAConversationRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

void (empty response body)

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

# **toggleStatusOfAConversation**
> ToggleStatusOfAConversation200Response toggleStatusOfAConversation(toggleStatusOfAConversationRequest)

Toggle the status of a conversation. Pass `status` to explicitly set the conversation state. Use `snoozed` along with `snoozed_until` to snooze a conversation until a specific time. If `snoozed_until` is omitted, the conversation is snoozed until the next reply from the contact. Regardless of the value provided, snoozed conversations always reopen on the next reply from the contact.

### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ToggleStatusOfAConversationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let toggleStatusOfAConversationRequest: ToggleStatusOfAConversationRequest; //

const { status, data } = await apiInstance.toggleStatusOfAConversation(
    accountId,
    conversationId,
    toggleStatusOfAConversationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **toggleStatusOfAConversationRequest** | **ToggleStatusOfAConversationRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

**ToggleStatusOfAConversation200Response**

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
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateConversation**
> updateConversation(updateConversationRequest)

Update Conversation Attributes

### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    UpdateConversationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let updateConversationRequest: UpdateConversationRequest; //

const { status, data } = await apiInstance.updateConversation(
    accountId,
    conversationId,
    updateConversationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateConversationRequest** | **UpdateConversationRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

void (empty response body)

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

# **updateCustomAttributesOfAConversation**
> UpdateCustomAttributesOfAConversation200Response updateCustomAttributesOfAConversation(updateCustomAttributesOfAConversationRequest)

Updates the custom attributes of a conversation

### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    UpdateCustomAttributesOfAConversationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let conversationId: number; //The numeric ID of the conversation (default to undefined)
let updateCustomAttributesOfAConversationRequest: UpdateCustomAttributesOfAConversationRequest; //

const { status, data } = await apiInstance.updateCustomAttributesOfAConversation(
    accountId,
    conversationId,
    updateCustomAttributesOfAConversationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCustomAttributesOfAConversationRequest** | **UpdateCustomAttributesOfAConversationRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **conversationId** | [**number**] | The numeric ID of the conversation | defaults to undefined|


### Return type

**UpdateCustomAttributesOfAConversation200Response**

### Authorization

[userApiKey](../README.md#userApiKey)

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

