# InboxesApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNewAgentToInbox**](#addnewagenttoinbox) | **POST** /api/v1/accounts/{account_id}/inbox_members | Add a New Agent|
|[**deleteAgentInInbox**](#deleteagentininbox) | **DELETE** /api/v1/accounts/{account_id}/inbox_members | Remove an Agent from Inbox|
|[**getInbox**](#getinbox) | **GET** /api/v1/accounts/{account_id}/inboxes/{id}/ | Get an inbox|
|[**getInboxAgentBot**](#getinboxagentbot) | **GET** /api/v1/accounts/{account_id}/inboxes/{id}/agent_bot | Show Inbox Agent Bot|
|[**getInboxMembers**](#getinboxmembers) | **GET** /api/v1/accounts/{account_id}/inbox_members/{inbox_id} | List Agents in Inbox|
|[**inboxCreation**](#inboxcreation) | **POST** /api/v1/accounts/{account_id}/inboxes/ | Create an inbox|
|[**listAllInboxes**](#listallinboxes) | **GET** /api/v1/accounts/{account_id}/inboxes | List all inboxes|
|[**updateAgentBot**](#updateagentbot) | **POST** /api/v1/accounts/{account_id}/inboxes/{id}/set_agent_bot | Add or remove agent bot|
|[**updateAgentsInInbox**](#updateagentsininbox) | **PATCH** /api/v1/accounts/{account_id}/inbox_members | Update Agents in Inbox|
|[**updateInbox**](#updateinbox) | **PATCH** /api/v1/accounts/{account_id}/inboxes/{id} | Update Inbox|

# **addNewAgentToInbox**
> GetInboxMembers200Response addNewAgentToInbox(addNewAgentToInboxRequest)

Add a new Agent to Inbox

### Example

```typescript
import {
    InboxesApi,
    Configuration,
    AddNewAgentToInboxRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let addNewAgentToInboxRequest: AddNewAgentToInboxRequest; //

const { status, data } = await apiInstance.addNewAgentToInbox(
    accountId,
    addNewAgentToInboxRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addNewAgentToInboxRequest** | **AddNewAgentToInboxRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**GetInboxMembers200Response**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Inbox not found |  -  |
|**403** | Access denied |  -  |
|**422** | User must exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAgentInInbox**
> deleteAgentInInbox(deleteAgentInInboxRequest)

Remove an Agent from Inbox

### Example

```typescript
import {
    InboxesApi,
    Configuration,
    DeleteAgentInInboxRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let deleteAgentInInboxRequest: DeleteAgentInInboxRequest; //

const { status, data } = await apiInstance.deleteAgentInInbox(
    accountId,
    deleteAgentInInboxRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deleteAgentInInboxRequest** | **DeleteAgentInInboxRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Inbox not found |  -  |
|**403** | Access denied |  -  |
|**422** | User must exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInbox**
> Inbox getInbox()

Get an inbox available in the current account

### Example

```typescript
import {
    InboxesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the inbox (default to undefined)

const { status, data } = await apiInstance.getInbox(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | ID of the inbox | defaults to undefined|


### Return type

**Inbox**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Inbox not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInboxAgentBot**
> AgentBot getInboxAgentBot()

See if an agent bot is associated to the Inbox

### Example

```typescript
import {
    InboxesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the inbox (default to undefined)

const { status, data } = await apiInstance.getInboxAgentBot(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | ID of the inbox | defaults to undefined|


### Return type

**AgentBot**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Success |  -  |
|**404** | Inbox not found, Agent bot not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getInboxMembers**
> GetInboxMembers200Response getInboxMembers()

Get Details of Agents in an Inbox

### Example

```typescript
import {
    InboxesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let inboxId: number; //The ID of the Inbox (default to undefined)

const { status, data } = await apiInstance.getInboxMembers(
    accountId,
    inboxId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **inboxId** | [**number**] | The ID of the Inbox | defaults to undefined|


### Return type

**GetInboxMembers200Response**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Inbox not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **inboxCreation**
> Inbox inboxCreation(inboxCreatePayload)

You can create more than one website inbox in each account

### Example

```typescript
import {
    InboxesApi,
    Configuration,
    InboxCreatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let inboxCreatePayload: InboxCreatePayload; //

const { status, data } = await apiInstance.inboxCreation(
    accountId,
    inboxCreatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inboxCreatePayload** | **InboxCreatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Inbox**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Inbox not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllInboxes**
> ListAllInboxes200Response listAllInboxes()

List all inboxes available in the current account

### Example

```typescript
import {
    InboxesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.listAllInboxes(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**ListAllInboxes200Response**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Inbox not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAgentBot**
> updateAgentBot(updateAgentBotRequest)

To add an agent bot pass agent_bot id, to remove agent bot from an inbox pass null

### Example

```typescript
import {
    InboxesApi,
    Configuration,
    UpdateAgentBotRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the inbox (default to undefined)
let updateAgentBotRequest: UpdateAgentBotRequest; //

const { status, data } = await apiInstance.updateAgentBot(
    accountId,
    id,
    updateAgentBotRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAgentBotRequest** | **UpdateAgentBotRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | ID of the inbox | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Success |  -  |
|**404** | Inbox not found, Agent bot not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAgentsInInbox**
> GetInboxMembers200Response updateAgentsInInbox(updateAgentsInInboxRequest)

All agents except the one passed in params will be removed

### Example

```typescript
import {
    InboxesApi,
    Configuration,
    UpdateAgentsInInboxRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let updateAgentsInInboxRequest: UpdateAgentsInInboxRequest; //

const { status, data } = await apiInstance.updateAgentsInInbox(
    accountId,
    updateAgentsInInboxRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAgentsInInboxRequest** | **UpdateAgentsInInboxRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**GetInboxMembers200Response**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Inbox not found |  -  |
|**403** | Access denied |  -  |
|**422** | User must exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateInbox**
> Inbox updateInbox(inboxUpdatePayload)

Update an existing inbox

### Example

```typescript
import {
    InboxesApi,
    Configuration,
    InboxUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the inbox (default to undefined)
let inboxUpdatePayload: InboxUpdatePayload; //

const { status, data } = await apiInstance.updateInbox(
    accountId,
    id,
    inboxUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inboxUpdatePayload** | **InboxUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | ID of the inbox | defaults to undefined|


### Return type

**Inbox**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Inbox not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

