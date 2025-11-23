# AccountsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAnAccount**](#createanaccount) | **POST** /platform/api/v1/accounts | Create an Account|
|[**deleteAnAccount**](#deleteanaccount) | **DELETE** /platform/api/v1/accounts/{account_id} | Delete an Account|
|[**getDetailsOfAnAccount**](#getdetailsofanaccount) | **GET** /platform/api/v1/accounts/{account_id} | Get an account details|
|[**updateAnAccount**](#updateanaccount) | **PATCH** /platform/api/v1/accounts/{account_id} | Update an account|

# **createAnAccount**
> PlatformAccount createAnAccount(accountCreateUpdatePayload)

Create an Account

### Example

```typescript
import {
    AccountsApi,
    Configuration,
    AccountCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let accountCreateUpdatePayload: AccountCreateUpdatePayload; //

const { status, data } = await apiInstance.createAnAccount(
    accountCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountCreateUpdatePayload** | **AccountCreateUpdatePayload**|  | |


### Return type

**PlatformAccount**

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

# **deleteAnAccount**
> deleteAnAccount()

Delete an Account

### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.deleteAnAccount(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


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
|**404** | The account does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfAnAccount**
> PlatformAccount getDetailsOfAnAccount()

Get the details of an account

### Example

```typescript
import {
    AccountsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.getDetailsOfAnAccount(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**PlatformAccount**

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
|**404** | The given account does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAnAccount**
> PlatformAccount updateAnAccount(accountCreateUpdatePayload)

Update an account\'s attributes

### Example

```typescript
import {
    AccountsApi,
    Configuration,
    AccountCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let accountCreateUpdatePayload: AccountCreateUpdatePayload; //

const { status, data } = await apiInstance.updateAnAccount(
    accountId,
    accountCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountCreateUpdatePayload** | **AccountCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**PlatformAccount**

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

