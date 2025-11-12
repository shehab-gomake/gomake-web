# HelpCenterApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNewArticleToAccount**](#addnewarticletoaccount) | **POST** /api/v1/accounts/{account_id}/portals/{id}/articles | Add a new article|
|[**addNewCategoryToAccount**](#addnewcategorytoaccount) | **POST** /api/v1/accounts/{account_id}/portals/{id}/categories | Add a new category|
|[**addNewPortalToAccount**](#addnewportaltoaccount) | **POST** /api/v1/accounts/{account_id}/portals | Add a new portal|
|[**getPortal**](#getportal) | **GET** /api/v1/accounts/{account_id}/portals | List all portals in an account|
|[**updatePortalToAccount**](#updateportaltoaccount) | **PATCH** /api/v1/accounts/{account_id}/portals/{id} | Update a portal|

# **addNewArticleToAccount**
> Article addNewArticleToAccount(articleCreateUpdatePayload)

Add a new article to portal

### Example

```typescript
import {
    HelpCenterApi,
    Configuration,
    ArticleCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new HelpCenterApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: string; //The slug identifier of the portal (default to undefined)
let articleCreateUpdatePayload: ArticleCreateUpdatePayload; //

const { status, data } = await apiInstance.addNewArticleToAccount(
    accountId,
    id,
    articleCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **articleCreateUpdatePayload** | **ArticleCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**string**] | The slug identifier of the portal | defaults to undefined|


### Return type

**Article**

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

# **addNewCategoryToAccount**
> Category addNewCategoryToAccount(categoryCreateUpdatePayload)

Add a new category to portal

### Example

```typescript
import {
    HelpCenterApi,
    Configuration,
    CategoryCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new HelpCenterApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: string; //The slug identifier of the portal (default to undefined)
let categoryCreateUpdatePayload: CategoryCreateUpdatePayload; //

const { status, data } = await apiInstance.addNewCategoryToAccount(
    accountId,
    id,
    categoryCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryCreateUpdatePayload** | **CategoryCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**string**] | The slug identifier of the portal | defaults to undefined|


### Return type

**Category**

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

# **addNewPortalToAccount**
> Portal addNewPortalToAccount(portalCreateUpdatePayload)

Add a new portal to account

### Example

```typescript
import {
    HelpCenterApi,
    Configuration,
    PortalCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new HelpCenterApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let portalCreateUpdatePayload: PortalCreateUpdatePayload; //

const { status, data } = await apiInstance.addNewPortalToAccount(
    accountId,
    portalCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **portalCreateUpdatePayload** | **PortalCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Portal**

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

# **getPortal**
> Portal getPortal()

Get details of portals in an Account

### Example

```typescript
import {
    HelpCenterApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HelpCenterApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.getPortal(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Portal**

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

# **updatePortalToAccount**
> PortalSingle updatePortalToAccount(portalCreateUpdatePayload)

Update a portal to account

### Example

```typescript
import {
    HelpCenterApi,
    Configuration,
    PortalCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new HelpCenterApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: string; //The slug identifier of the portal (default to undefined)
let portalCreateUpdatePayload: PortalCreateUpdatePayload; //

const { status, data } = await apiInstance.updatePortalToAccount(
    accountId,
    id,
    portalCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **portalCreateUpdatePayload** | **PortalCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**string**] | The slug identifier of the portal | defaults to undefined|


### Return type

**PortalSingle**

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
|**404** | Portal not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

