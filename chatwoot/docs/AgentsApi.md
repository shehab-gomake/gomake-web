# AgentsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNewAgentToAccount**](#addnewagenttoaccount) | **POST** /api/v1/accounts/{account_id}/agents | Add a New Agent|
|[**deleteAgentFromAccount**](#deleteagentfromaccount) | **DELETE** /api/v1/accounts/{account_id}/agents/{id} | Remove an Agent from Account|
|[**getAccountAgents**](#getaccountagents) | **GET** /api/v1/accounts/{account_id}/agents | List Agents in Account|
|[**updateAgentInAccount**](#updateagentinaccount) | **PATCH** /api/v1/accounts/{account_id}/agents/{id} | Update Agent in Account|

# **addNewAgentToAccount**
> Agent addNewAgentToAccount(agentCreatePayload)

Add a new Agent to Account

### Example

```typescript
import {
    AgentsApi,
    Configuration,
    AgentCreatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let agentCreatePayload: AgentCreatePayload; //

const { status, data } = await apiInstance.addNewAgentToAccount(
    accountId,
    agentCreatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **agentCreatePayload** | **AgentCreatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Agent**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAgentFromAccount**
> deleteAgentFromAccount()

Remove an Agent from Account

### Example

```typescript
import {
    AgentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the agent to be deleted. (default to undefined)

const { status, data } = await apiInstance.deleteAgentFromAccount(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the agent to be deleted. | defaults to undefined|


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
|**404** | Agent not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAccountAgents**
> Array<Agent> getAccountAgents()

Get Details of Agents in an Account

### Example

```typescript
import {
    AgentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.getAccountAgents(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Array<Agent>**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAgentInAccount**
> Agent updateAgentInAccount(agentUpdatePayload)

Update an Agent in Account

### Example

```typescript
import {
    AgentsApi,
    Configuration,
    AgentUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the agent to be updated. (default to undefined)
let agentUpdatePayload: AgentUpdatePayload; //

const { status, data } = await apiInstance.updateAgentInAccount(
    accountId,
    id,
    agentUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **agentUpdatePayload** | **AgentUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the agent to be updated. | defaults to undefined|


### Return type

**Agent**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Agent not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

