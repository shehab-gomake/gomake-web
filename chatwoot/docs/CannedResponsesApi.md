# CannedResponsesApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNewCannedResponseToAccount**](#addnewcannedresponsetoaccount) | **POST** /api/v1/accounts/{account_id}/canned_responses | Add a New Canned Response|
|[**deleteCannedResponseFromAccount**](#deletecannedresponsefromaccount) | **DELETE** /api/v1/accounts/{account_id}/canned_responses/{id} | Remove a Canned Response from Account|
|[**getAccountCannedResponse**](#getaccountcannedresponse) | **GET** /api/v1/accounts/{account_id}/canned_responses | List all Canned Responses in an Account|
|[**updateCannedResponseInAccount**](#updatecannedresponseinaccount) | **PATCH** /api/v1/accounts/{account_id}/canned_responses/{id} | Update Canned Response in Account|

# **addNewCannedResponseToAccount**
> CannedResponse addNewCannedResponseToAccount(cannedResponseCreateUpdatePayload)

Add a new Canned Response to Account

### Example

```typescript
import {
    CannedResponsesApi,
    Configuration,
    CannedResponseCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new CannedResponsesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let cannedResponseCreateUpdatePayload: CannedResponseCreateUpdatePayload; //

const { status, data } = await apiInstance.addNewCannedResponseToAccount(
    accountId,
    cannedResponseCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cannedResponseCreateUpdatePayload** | **CannedResponseCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**CannedResponse**

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

# **deleteCannedResponseFromAccount**
> deleteCannedResponseFromAccount()

Remove a Canned Response from Account

### Example

```typescript
import {
    CannedResponsesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CannedResponsesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the canned response to be deleted (default to undefined)

const { status, data } = await apiInstance.deleteCannedResponseFromAccount(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the canned response to be deleted | defaults to undefined|


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
|**404** | Canned Response not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAccountCannedResponse**
> Array<CannedResponse> getAccountCannedResponse()

Get Details of Canned Responses in an Account

### Example

```typescript
import {
    CannedResponsesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CannedResponsesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.getAccountCannedResponse(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Array<CannedResponse>**

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

# **updateCannedResponseInAccount**
> CannedResponse updateCannedResponseInAccount(cannedResponseCreateUpdatePayload)

Update a Canned Response in Account

### Example

```typescript
import {
    CannedResponsesApi,
    Configuration,
    CannedResponseCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new CannedResponsesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the canned response to be updated. (default to undefined)
let cannedResponseCreateUpdatePayload: CannedResponseCreateUpdatePayload; //

const { status, data } = await apiInstance.updateCannedResponseInAccount(
    accountId,
    id,
    cannedResponseCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cannedResponseCreateUpdatePayload** | **CannedResponseCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the canned response to be updated. | defaults to undefined|


### Return type

**CannedResponse**

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

