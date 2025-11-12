# CustomAttributesApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNewCustomAttributeToAccount**](#addnewcustomattributetoaccount) | **POST** /api/v1/accounts/{account_id}/custom_attribute_definitions | Add a new custom attribute|
|[**deleteCustomAttributeFromAccount**](#deletecustomattributefromaccount) | **DELETE** /api/v1/accounts/{account_id}/custom_attribute_definitions/{id} | Remove a custom attribute from account|
|[**getAccountCustomAttribute**](#getaccountcustomattribute) | **GET** /api/v1/accounts/{account_id}/custom_attribute_definitions | List all custom attributes in an account|
|[**getDetailsOfASingleCustomAttribute**](#getdetailsofasinglecustomattribute) | **GET** /api/v1/accounts/{account_id}/custom_attribute_definitions/{id} | Get a custom attribute details|
|[**updateCustomAttributeInAccount**](#updatecustomattributeinaccount) | **PATCH** /api/v1/accounts/{account_id}/custom_attribute_definitions/{id} | Update custom attribute in Account|

# **addNewCustomAttributeToAccount**
> CustomAttribute addNewCustomAttributeToAccount(customAttributeCreateUpdatePayload)

Add a new custom attribute to account

### Example

```typescript
import {
    CustomAttributesApi,
    Configuration,
    CustomAttributeCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomAttributesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let customAttributeCreateUpdatePayload: CustomAttributeCreateUpdatePayload; //

const { status, data } = await apiInstance.addNewCustomAttributeToAccount(
    accountId,
    customAttributeCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customAttributeCreateUpdatePayload** | **CustomAttributeCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**CustomAttribute**

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

# **deleteCustomAttributeFromAccount**
> deleteCustomAttributeFromAccount()

Remove a custom attribute from account

### Example

```typescript
import {
    CustomAttributesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomAttributesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the custom attribute to be deleted (default to undefined)

const { status, data } = await apiInstance.deleteCustomAttributeFromAccount(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the custom attribute to be deleted | defaults to undefined|


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
|**404** | Custom attribute not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAccountCustomAttribute**
> Array<CustomAttribute> getAccountCustomAttribute()

Get details of custom attributes in an Account

### Example

```typescript
import {
    CustomAttributesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomAttributesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let attributeModel: '0' | '1'; //conversation_attribute(0)/contact_attribute(1) (default to undefined)

const { status, data } = await apiInstance.getAccountCustomAttribute(
    accountId,
    attributeModel
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **attributeModel** | [**&#39;0&#39; | &#39;1&#39;**]**Array<&#39;0&#39; &#124; &#39;1&#39;>** | conversation_attribute(0)/contact_attribute(1) | defaults to undefined|


### Return type

**Array<CustomAttribute>**

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

# **getDetailsOfASingleCustomAttribute**
> CustomAttribute getDetailsOfASingleCustomAttribute()

Get the details of a custom attribute in the account

### Example

```typescript
import {
    CustomAttributesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomAttributesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the custom attribute to be updated. (default to undefined)

const { status, data } = await apiInstance.getDetailsOfASingleCustomAttribute(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the custom attribute to be updated. | defaults to undefined|


### Return type

**CustomAttribute**

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
|**404** | The given attribute ID does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCustomAttributeInAccount**
> CustomAttribute updateCustomAttributeInAccount(customAttributeCreateUpdatePayload)

Update a custom attribute in account

### Example

```typescript
import {
    CustomAttributesApi,
    Configuration,
    CustomAttributeCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomAttributesApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the custom attribute to be updated. (default to undefined)
let customAttributeCreateUpdatePayload: CustomAttributeCreateUpdatePayload; //

const { status, data } = await apiInstance.updateCustomAttributeInAccount(
    accountId,
    id,
    customAttributeCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customAttributeCreateUpdatePayload** | **CustomAttributeCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the custom attribute to be updated. | defaults to undefined|


### Return type

**CustomAttribute**

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

