# AccountApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAccountDetails**](#getaccountdetails) | **GET** /api/v1/accounts/{id} | Get account details|
|[**updateAccount**](#updateaccount) | **PATCH** /api/v1/accounts/{id} | Update account|

# **getAccountDetails**
> AccountShowResponse getAccountDetails()

Get the details of the current account

### Example

```typescript
import {
    AccountApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.getAccountDetails(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**AccountShowResponse**

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
|**404** | Account not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAccount**
> AccountDetail updateAccount(accountUpdatePayload)

Update account details, settings, and custom attributes

### Example

```typescript
import {
    AccountApi,
    Configuration,
    AccountUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let accountUpdatePayload: AccountUpdatePayload; //

const { status, data } = await apiInstance.updateAccount(
    accountId,
    accountUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountUpdatePayload** | **AccountUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**AccountDetail**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized (requires administrator role) |  -  |
|**404** | Account not found |  -  |
|**422** | Validation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

