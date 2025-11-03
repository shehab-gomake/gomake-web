# CustomFiltersApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createACustomFilter**](#createacustomfilter) | **POST** /api/v1/accounts/{account_id}/custom_filters | Create a custom filter|
|[**deleteACustomFilter**](#deleteacustomfilter) | **DELETE** /api/v1/accounts/{account_id}/custom_filters/{custom_filter_id} | Delete a custom filter|
|[**getDetailsOfASingleCustomFilter**](#getdetailsofasinglecustomfilter) | **GET** /api/v1/accounts/{account_id}/custom_filters/{custom_filter_id} | Get a custom filter details|
|[**listAllFilters**](#listallfilters) | **GET** /api/v1/accounts/{account_id}/custom_filters | List all custom filters|
|[**updateACustomFilter**](#updateacustomfilter) | **PATCH** /api/v1/accounts/{account_id}/custom_filters/{custom_filter_id} | Update a custom filter|

# **createACustomFilter**
> CustomFilter createACustomFilter(customFilterCreateUpdatePayload)

Create a custom filter in the account

### Example

```typescript
import {
    CustomFiltersApi,
    Configuration,
    CustomFilterCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomFiltersApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let customFilterCreateUpdatePayload: CustomFilterCreateUpdatePayload; //
let filterType: 'conversation' | 'contact' | 'report'; //The type of custom filter (optional) (default to undefined)

const { status, data } = await apiInstance.createACustomFilter(
    accountId,
    customFilterCreateUpdatePayload,
    filterType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customFilterCreateUpdatePayload** | **CustomFilterCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **filterType** | [**&#39;conversation&#39; | &#39;contact&#39; | &#39;report&#39;**]**Array<&#39;conversation&#39; &#124; &#39;contact&#39; &#124; &#39;report&#39;>** | The type of custom filter | (optional) defaults to undefined|


### Return type

**CustomFilter**

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

# **deleteACustomFilter**
> deleteACustomFilter()

Delete a custom filter from the account

### Example

```typescript
import {
    CustomFiltersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomFiltersApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let customFilterId: number; //The numeric ID of the custom filter (default to undefined)

const { status, data } = await apiInstance.deleteACustomFilter(
    accountId,
    customFilterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **customFilterId** | [**number**] | The numeric ID of the custom filter | defaults to undefined|


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
|**404** | The custom filter does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfASingleCustomFilter**
> CustomFilter getDetailsOfASingleCustomFilter()

Get the details of a custom filter in the account

### Example

```typescript
import {
    CustomFiltersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomFiltersApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let customFilterId: number; //The numeric ID of the custom filter (default to undefined)

const { status, data } = await apiInstance.getDetailsOfASingleCustomFilter(
    accountId,
    customFilterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **customFilterId** | [**number**] | The numeric ID of the custom filter | defaults to undefined|


### Return type

**CustomFilter**

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
|**404** | The given team ID does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllFilters**
> Array<CustomFilter> listAllFilters()

List all custom filters in a category of a user

### Example

```typescript
import {
    CustomFiltersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomFiltersApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let filterType: 'conversation' | 'contact' | 'report'; //The type of custom filter (optional) (default to undefined)

const { status, data } = await apiInstance.listAllFilters(
    accountId,
    filterType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **filterType** | [**&#39;conversation&#39; | &#39;contact&#39; | &#39;report&#39;**]**Array<&#39;conversation&#39; &#124; &#39;contact&#39; &#124; &#39;report&#39;>** | The type of custom filter | (optional) defaults to undefined|


### Return type

**Array<CustomFilter>**

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

# **updateACustomFilter**
> CustomFilter updateACustomFilter(customFilterCreateUpdatePayload)

Update a custom filter\'s attributes

### Example

```typescript
import {
    CustomFiltersApi,
    Configuration,
    CustomFilterCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomFiltersApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let customFilterId: number; //The numeric ID of the custom filter (default to undefined)
let customFilterCreateUpdatePayload: CustomFilterCreateUpdatePayload; //

const { status, data } = await apiInstance.updateACustomFilter(
    accountId,
    customFilterId,
    customFilterCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customFilterCreateUpdatePayload** | **CustomFilterCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **customFilterId** | [**number**] | The numeric ID of the custom filter | defaults to undefined|


### Return type

**CustomFilter**

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

