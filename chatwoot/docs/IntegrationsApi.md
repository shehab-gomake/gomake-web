# IntegrationsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAnIntegrationHook**](#createanintegrationhook) | **POST** /api/v1/accounts/{account_id}/integrations/hooks | Create an integration hook|
|[**deleteAnIntegrationHook**](#deleteanintegrationhook) | **DELETE** /api/v1/accounts/{account_id}/integrations/hooks/{hook_id} | Delete an Integration Hook|
|[**getDetailsOfAllIntegrations**](#getdetailsofallintegrations) | **GET** /api/v1/accounts/{account_id}/integrations/apps | List all the Integrations|
|[**updateAnIntegrationsHook**](#updateanintegrationshook) | **PATCH** /api/v1/accounts/{account_id}/integrations/hooks/{hook_id} | Update an Integration Hook|

# **createAnIntegrationHook**
> IntegrationsHook createAnIntegrationHook(integrationsHookCreatePayload)

Create an integration hook

### Example

```typescript
import {
    IntegrationsApi,
    Configuration,
    IntegrationsHookCreatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new IntegrationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let integrationsHookCreatePayload: IntegrationsHookCreatePayload; //

const { status, data } = await apiInstance.createAnIntegrationHook(
    accountId,
    integrationsHookCreatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **integrationsHookCreatePayload** | **IntegrationsHookCreatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**IntegrationsHook**

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

# **deleteAnIntegrationHook**
> deleteAnIntegrationHook()

Delete an Integration Hook

### Example

```typescript
import {
    IntegrationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IntegrationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let hookId: number; //The numeric ID of the integration hook (default to undefined)

const { status, data } = await apiInstance.deleteAnIntegrationHook(
    accountId,
    hookId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **hookId** | [**number**] | The numeric ID of the integration hook | defaults to undefined|


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
|**404** | The hook does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfAllIntegrations**
> GetDetailsOfAllIntegrations200Response getDetailsOfAllIntegrations()

Get the details of all Integrations available for the account

### Example

```typescript
import {
    IntegrationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new IntegrationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.getDetailsOfAllIntegrations(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**GetDetailsOfAllIntegrations200Response**

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
|**404** | Url not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAnIntegrationsHook**
> IntegrationsHook updateAnIntegrationsHook(integrationsHookUpdatePayload)

Update an Integration Hook

### Example

```typescript
import {
    IntegrationsApi,
    Configuration,
    IntegrationsHookUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new IntegrationsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let hookId: number; //The numeric ID of the integration hook (default to undefined)
let integrationsHookUpdatePayload: IntegrationsHookUpdatePayload; //

const { status, data } = await apiInstance.updateAnIntegrationsHook(
    accountId,
    hookId,
    integrationsHookUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **integrationsHookUpdatePayload** | **IntegrationsHookUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **hookId** | [**number**] | The numeric ID of the integration hook | defaults to undefined|


### Return type

**IntegrationsHook**

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

