# AgentBotsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAnAgentBot**](#createanagentbot) | **POST** /platform/api/v1/agent_bots | Create an Agent Bot|
|[**deleteAnAgentBot**](#deleteanagentbot) | **DELETE** /platform/api/v1/agent_bots/{id} | Delete an AgentBot|
|[**getDetailsOfASingleAgentBot**](#getdetailsofasingleagentbot) | **GET** /platform/api/v1/agent_bots/{id} | Get an agent bot details|
|[**listAllAgentBots**](#listallagentbots) | **GET** /platform/api/v1/agent_bots | List all AgentBots|
|[**updateAnAgentBot**](#updateanagentbot) | **PATCH** /platform/api/v1/agent_bots/{id} | Update an agent bot|

# **createAnAgentBot**
> AgentBot createAnAgentBot(platformAgentBotCreateUpdatePayload)

Create an agent bot

### Example

```typescript
import {
    AgentBotsApi,
    Configuration,
    PlatformAgentBotCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentBotsApi(configuration);

let platformAgentBotCreateUpdatePayload: PlatformAgentBotCreateUpdatePayload; //

const { status, data } = await apiInstance.createAnAgentBot(
    platformAgentBotCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **platformAgentBotCreateUpdatePayload** | **PlatformAgentBotCreateUpdatePayload**|  | |


### Return type

**AgentBot**

### Authorization

[platformAppApiKey](../README.md#platformAppApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAnAgentBot**
> deleteAnAgentBot()

Delete an AgentBot

### Example

```typescript
import {
    AgentBotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentBotsApi(configuration);

let id: number; //The ID of the agentbot to be updated (default to undefined)

const { status, data } = await apiInstance.deleteAnAgentBot(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | The ID of the agentbot to be updated | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[platformAppApiKey](../README.md#platformAppApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |
|**404** | The agent bot does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfASingleAgentBot**
> AgentBot getDetailsOfASingleAgentBot()

Get the details of an agent bot

### Example

```typescript
import {
    AgentBotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentBotsApi(configuration);

let id: number; //The ID of the agentbot to be updated (default to undefined)

const { status, data } = await apiInstance.getDetailsOfASingleAgentBot(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | The ID of the agentbot to be updated | defaults to undefined|


### Return type

**AgentBot**

### Authorization

[platformAppApiKey](../README.md#platformAppApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |
|**404** | The given agent bot ID does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllAgentBots**
> Array<AgentBot> listAllAgentBots()

List all agent bots available

### Example

```typescript
import {
    AgentBotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentBotsApi(configuration);

const { status, data } = await apiInstance.listAllAgentBots();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<AgentBot>**

### Authorization

[platformAppApiKey](../README.md#platformAppApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAnAgentBot**
> AgentBot updateAnAgentBot(platformAgentBotCreateUpdatePayload)

Update an agent bot\'s attributes

### Example

```typescript
import {
    AgentBotsApi,
    Configuration,
    PlatformAgentBotCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AgentBotsApi(configuration);

let id: number; //The ID of the agentbot to be updated (default to undefined)
let platformAgentBotCreateUpdatePayload: PlatformAgentBotCreateUpdatePayload; //

const { status, data } = await apiInstance.updateAnAgentBot(
    id,
    platformAgentBotCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **platformAgentBotCreateUpdatePayload** | **PlatformAgentBotCreateUpdatePayload**|  | |
| **id** | [**number**] | The ID of the agentbot to be updated | defaults to undefined|


### Return type

**AgentBot**

### Authorization

[platformAppApiKey](../README.md#platformAppApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

