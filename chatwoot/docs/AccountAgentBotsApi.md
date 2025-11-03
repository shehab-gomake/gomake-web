# AccountAgentBotsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAnAccountAgentBot**](#createanaccountagentbot) | **POST** /api/v1/accounts/{account_id}/agent_bots | Create an Agent Bot|
|[**deleteAnAccountAgentBot**](#deleteanaccountagentbot) | **DELETE** /api/v1/accounts/{account_id}/agent_bots/{id} | Delete an AgentBot|
|[**getDetailsOfASingleAccountAgentBot**](#getdetailsofasingleaccountagentbot) | **GET** /api/v1/accounts/{account_id}/agent_bots/{id} | Get an agent bot details|
|[**listAllAccountAgentBots**](#listallaccountagentbots) | **GET** /api/v1/accounts/{account_id}/agent_bots | List all AgentBots|
|[**updateAnAccountAgentBot**](#updateanaccountagentbot) | **PATCH** /api/v1/accounts/{account_id}/agent_bots/{id} | Update an agent bot|

# **createAnAccountAgentBot**
> AgentBot createAnAccountAgentBot(agentBotCreateUpdatePayload)

Create an agent bot in the account

### Example

```typescript
import {
    AccountAgentBotsApi,
    Configuration,
    AgentBotCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountAgentBotsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let agentBotCreateUpdatePayload: AgentBotCreateUpdatePayload; //

const { status, data } = await apiInstance.createAnAccountAgentBot(
    accountId,
    agentBotCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **agentBotCreateUpdatePayload** | **AgentBotCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**AgentBot**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAnAccountAgentBot**
> deleteAnAccountAgentBot()

Delete an AgentBot from the account

### Example

```typescript
import {
    AccountAgentBotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountAgentBotsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the agentbot to be updated (default to undefined)

const { status, data } = await apiInstance.deleteAnAccountAgentBot(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the agentbot to be updated | defaults to undefined|


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
|**404** | The agent bot does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfASingleAccountAgentBot**
> AgentBot getDetailsOfASingleAccountAgentBot()

Get the details of an agent bot in the account

### Example

```typescript
import {
    AccountAgentBotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountAgentBotsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the agentbot to be updated (default to undefined)

const { status, data } = await apiInstance.getDetailsOfASingleAccountAgentBot(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the agentbot to be updated | defaults to undefined|


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
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |
|**404** | The given agent bot ID does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllAccountAgentBots**
> Array<AgentBot> listAllAccountAgentBots()

List all agent bots available for the current account

### Example

```typescript
import {
    AccountAgentBotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountAgentBotsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.listAllAccountAgentBots(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Array<AgentBot>**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAnAccountAgentBot**
> AgentBot updateAnAccountAgentBot(agentBotCreateUpdatePayload)

Update an agent bot\'s attributes

### Example

```typescript
import {
    AccountAgentBotsApi,
    Configuration,
    AgentBotCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountAgentBotsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the agentbot to be updated (default to undefined)
let agentBotCreateUpdatePayload: AgentBotCreateUpdatePayload; //

const { status, data } = await apiInstance.updateAnAccountAgentBot(
    accountId,
    id,
    agentBotCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **agentBotCreateUpdatePayload** | **AgentBotCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the agentbot to be updated | defaults to undefined|


### Return type

**AgentBot**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

