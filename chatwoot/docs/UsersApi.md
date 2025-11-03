# UsersApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAUser**](#createauser) | **POST** /platform/api/v1/users | Create a User|
|[**deleteAUser**](#deleteauser) | **DELETE** /platform/api/v1/users/{id} | Delete a User|
|[**getDetailsOfAUser**](#getdetailsofauser) | **GET** /platform/api/v1/users/{id} | Get an user details|
|[**getSsoUrlOfAUser**](#getssourlofauser) | **GET** /platform/api/v1/users/{id}/login | Get User SSO Link|
|[**updateAUser**](#updateauser) | **PATCH** /platform/api/v1/users/{id} | Update a user|

# **createAUser**
> User createAUser(userCreateUpdatePayload)

Create a User

### Example

```typescript
import {
    UsersApi,
    Configuration,
    UserCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userCreateUpdatePayload: UserCreateUpdatePayload; //

const { status, data } = await apiInstance.createAUser(
    userCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userCreateUpdatePayload** | **UserCreateUpdatePayload**|  | |


### Return type

**User**

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

# **deleteAUser**
> deleteAUser()

Delete a User

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //The numeric ID of the user on the platform (default to undefined)

const { status, data } = await apiInstance.deleteAUser(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | The numeric ID of the user on the platform | defaults to undefined|


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
|**404** | The user does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfAUser**
> User getDetailsOfAUser()

Get the details of an user

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //The numeric ID of the user on the platform (default to undefined)

const { status, data } = await apiInstance.getDetailsOfAUser(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | The numeric ID of the user on the platform | defaults to undefined|


### Return type

**User**

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
|**404** | The given user does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSsoUrlOfAUser**
> GetSsoUrlOfAUser200Response getSsoUrlOfAUser()

Get the sso link of a user

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //The numeric ID of the user on the platform (default to undefined)

const { status, data } = await apiInstance.getSsoUrlOfAUser(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | The numeric ID of the user on the platform | defaults to undefined|


### Return type

**GetSsoUrlOfAUser200Response**

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
|**404** | The given user does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAUser**
> User updateAUser(userCreateUpdatePayload)

Update a user\'s attributes

### Example

```typescript
import {
    UsersApi,
    Configuration,
    UserCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: number; //The numeric ID of the user on the platform (default to undefined)
let userCreateUpdatePayload: UserCreateUpdatePayload; //

const { status, data } = await apiInstance.updateAUser(
    id,
    userCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userCreateUpdatePayload** | **UserCreateUpdatePayload**|  | |
| **id** | [**number**] | The numeric ID of the user on the platform | defaults to undefined|


### Return type

**User**

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

