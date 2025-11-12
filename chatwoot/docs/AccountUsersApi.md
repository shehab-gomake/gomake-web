# AccountUsersApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAnAccountUser**](#createanaccountuser) | **POST** /platform/api/v1/accounts/{account_id}/account_users | Create an Account User|
|[**deleteAnAccountUser**](#deleteanaccountuser) | **DELETE** /platform/api/v1/accounts/{account_id}/account_users | Delete an Account User|
|[**listAllAccountUsers**](#listallaccountusers) | **GET** /platform/api/v1/accounts/{account_id}/account_users | List all Account Users|

# **createAnAccountUser**
> CreateAnAccountUser200Response createAnAccountUser(accountUserCreateUpdatePayload)

Create an Account User

### Example

```typescript
import {
    AccountUsersApi,
    Configuration,
    AccountUserCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountUsersApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let accountUserCreateUpdatePayload: AccountUserCreateUpdatePayload; //

const { status, data } = await apiInstance.createAnAccountUser(
    accountId,
    accountUserCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountUserCreateUpdatePayload** | **AccountUserCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**CreateAnAccountUser200Response**

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

# **deleteAnAccountUser**
> deleteAnAccountUser()

Delete an Account User

### Example

```typescript
import {
    AccountUsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountUsersApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.deleteAnAccountUser(
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

# **listAllAccountUsers**
> Array<CreateAnAccountUser200Response> listAllAccountUsers()

List all account users

### Example

```typescript
import {
    AccountUsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AccountUsersApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.listAllAccountUsers(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Array<CreateAnAccountUser200Response>**

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

