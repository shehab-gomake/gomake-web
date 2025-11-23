# ReportsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAccountConversationMetrics**](#getaccountconversationmetrics) | **GET** /api/v2/accounts/{account_id}/reports/conversations | Account Conversation Metrics|
|[**getAgentConversationMetrics**](#getagentconversationmetrics) | **GET** /api/v2/accounts/{account_id}/reports/conversations/ | Agent Conversation Metrics|
|[**listAllConversationStatistics**](#listallconversationstatistics) | **GET** /api/v2/accounts/{account_id}/reports | Get Account reports|
|[**listAllConversationStatisticsSummary**](#listallconversationstatisticssummary) | **GET** /api/v2/accounts/{account_id}/reports/summary | Get Account reports summary|

# **getAccountConversationMetrics**
> GetAccountConversationMetrics200Response getAccountConversationMetrics()

Get conversation metrics for Account

### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let type: 'account'; //Type of report (default to undefined)

const { status, data } = await apiInstance.getAccountConversationMetrics(
    accountId,
    type
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **type** | [**&#39;account&#39;**]**Array<&#39;account&#39;>** | Type of report | defaults to undefined|


### Return type

**GetAccountConversationMetrics200Response**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | reports not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAgentConversationMetrics**
> Array<AgentConversationMetrics> getAgentConversationMetrics()

Get conversation metrics for Agent

### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let type: 'agent'; //Type of report (default to undefined)
let userId: string; //The numeric ID of the user (optional) (default to undefined)

const { status, data } = await apiInstance.getAgentConversationMetrics(
    accountId,
    type,
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **type** | [**&#39;agent&#39;**]**Array<&#39;agent&#39;>** | Type of report | defaults to undefined|
| **userId** | [**string**] | The numeric ID of the user | (optional) defaults to undefined|


### Return type

**Array<AgentConversationMetrics>**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | reports not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllConversationStatistics**
> Array<ListAllConversationStatistics200ResponseInner> listAllConversationStatistics()

Get Account reports for a specific type, metric and date range

### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let metric: 'conversations_count' | 'incoming_messages_count' | 'outgoing_messages_count' | 'avg_first_response_time' | 'avg_resolution_time' | 'resolutions_count'; //The type of metric (default to undefined)
let type: 'account' | 'agent' | 'inbox' | 'label' | 'team'; //Type of report (default to undefined)
let id: string; //The Id of specific object in case of agent/inbox/label (optional) (default to undefined)
let since: string; //The timestamp from where report should start. (optional) (default to undefined)
let until: string; //The timestamp from where report should stop. (optional) (default to undefined)

const { status, data } = await apiInstance.listAllConversationStatistics(
    accountId,
    metric,
    type,
    id,
    since,
    until
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **metric** | [**&#39;conversations_count&#39; | &#39;incoming_messages_count&#39; | &#39;outgoing_messages_count&#39; | &#39;avg_first_response_time&#39; | &#39;avg_resolution_time&#39; | &#39;resolutions_count&#39;**]**Array<&#39;conversations_count&#39; &#124; &#39;incoming_messages_count&#39; &#124; &#39;outgoing_messages_count&#39; &#124; &#39;avg_first_response_time&#39; &#124; &#39;avg_resolution_time&#39; &#124; &#39;resolutions_count&#39;>** | The type of metric | defaults to undefined|
| **type** | [**&#39;account&#39; | &#39;agent&#39; | &#39;inbox&#39; | &#39;label&#39; | &#39;team&#39;**]**Array<&#39;account&#39; &#124; &#39;agent&#39; &#124; &#39;inbox&#39; &#124; &#39;label&#39; &#124; &#39;team&#39;>** | Type of report | defaults to undefined|
| **id** | [**string**] | The Id of specific object in case of agent/inbox/label | (optional) defaults to undefined|
| **since** | [**string**] | The timestamp from where report should start. | (optional) defaults to undefined|
| **until** | [**string**] | The timestamp from where report should stop. | (optional) defaults to undefined|


### Return type

**Array<ListAllConversationStatistics200ResponseInner>**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | reports not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllConversationStatisticsSummary**
> AccountSummary listAllConversationStatisticsSummary()

Get Account reports summary for a specific type and date range

### Example

```typescript
import {
    ReportsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let type: 'account' | 'agent' | 'inbox' | 'label' | 'team'; //Type of report (default to undefined)
let id: string; //The Id of specific object in case of agent/inbox/label (optional) (default to undefined)
let since: string; //The timestamp from where report should start. (optional) (default to undefined)
let until: string; //The timestamp from where report should stop. (optional) (default to undefined)

const { status, data } = await apiInstance.listAllConversationStatisticsSummary(
    accountId,
    type,
    id,
    since,
    until
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **type** | [**&#39;account&#39; | &#39;agent&#39; | &#39;inbox&#39; | &#39;label&#39; | &#39;team&#39;**]**Array<&#39;account&#39; &#124; &#39;agent&#39; &#124; &#39;inbox&#39; &#124; &#39;label&#39; &#124; &#39;team&#39;>** | Type of report | defaults to undefined|
| **id** | [**string**] | The Id of specific object in case of agent/inbox/label | (optional) defaults to undefined|
| **since** | [**string**] | The timestamp from where report should start. | (optional) defaults to undefined|
| **until** | [**string**] | The timestamp from where report should stop. | (optional) defaults to undefined|


### Return type

**AccountSummary**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | reports not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

