# WebhooksApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAWebhook**](#createawebhook) | **POST** /api/v1/accounts/{account_id}/webhooks | Add a webhook|
|[**deleteAWebhook**](#deleteawebhook) | **DELETE** /api/v1/accounts/{account_id}/webhooks/{webhook_id} | Delete a webhook|
|[**listAllWebhooks**](#listallwebhooks) | **GET** /api/v1/accounts/{account_id}/webhooks | List all webhooks|
|[**updateAWebhook**](#updateawebhook) | **PATCH** /api/v1/accounts/{account_id}/webhooks/{webhook_id} | Update a webhook object|

# **createAWebhook**
> Webhook createAWebhook(webhookCreateUpdatePayload)

Add a webhook subscription to the account

### Example

```typescript
import {
    WebhooksApi,
    Configuration,
    WebhookCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let webhookCreateUpdatePayload: WebhookCreateUpdatePayload; //

const { status, data } = await apiInstance.createAWebhook(
    accountId,
    webhookCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **webhookCreateUpdatePayload** | **WebhookCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Webhook**

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

# **deleteAWebhook**
> deleteAWebhook()

Delete a webhook from the account

### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let webhookId: number; //The numeric ID of the webhook (default to undefined)

const { status, data } = await apiInstance.deleteAWebhook(
    accountId,
    webhookId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **webhookId** | [**number**] | The numeric ID of the webhook | defaults to undefined|


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
|**404** | The webhook does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllWebhooks**
> Array<Webhook> listAllWebhooks()

List all webhooks in the account

### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.listAllWebhooks(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Array<Webhook>**

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

# **updateAWebhook**
> Webhook updateAWebhook(webhookCreateUpdatePayload)

Update a webhook object in the account

### Example

```typescript
import {
    WebhooksApi,
    Configuration,
    WebhookCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let webhookId: number; //The numeric ID of the webhook (default to undefined)
let webhookCreateUpdatePayload: WebhookCreateUpdatePayload; //

const { status, data } = await apiInstance.updateAWebhook(
    accountId,
    webhookId,
    webhookCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **webhookCreateUpdatePayload** | **WebhookCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **webhookId** | [**number**] | The numeric ID of the webhook | defaults to undefined|


### Return type

**Webhook**

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

