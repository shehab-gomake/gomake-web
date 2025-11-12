# ContactsAPIApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAContact**](#createacontact) | **POST** /public/api/v1/inboxes/{inbox_identifier}/contacts | Create a contact|
|[**getDetailsOfAContact**](#getdetailsofacontact) | **GET** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier} | Get a contact|
|[**updateAContact**](#updateacontact) | **PATCH** /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier} | Update a contact|

# **createAContact**
> PublicContact createAContact(publicContactCreateUpdatePayload)

Create a contact

### Example

```typescript
import {
    ContactsAPIApi,
    Configuration,
    PublicContactCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let publicContactCreateUpdatePayload: PublicContactCreateUpdatePayload; //

const { status, data } = await apiInstance.createAContact(
    inboxIdentifier,
    publicContactCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **publicContactCreateUpdatePayload** | **PublicContactCreateUpdatePayload**|  | |
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|


### Return type

**PublicContact**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfAContact**
> PublicContact getDetailsOfAContact()

Get the details of a contact

### Example

```typescript
import {
    ContactsAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)

const { status, data } = await apiInstance.getDetailsOfAContact(
    inboxIdentifier,
    contactIdentifier
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|
| **contactIdentifier** | [**string**] | The source id of contact obtained on contact create | defaults to undefined|


### Return type

**PublicContact**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |
|**404** | The given contact does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAContact**
> PublicContact updateAContact(publicContactCreateUpdatePayload)

Update a contact\'s attributes

### Example

```typescript
import {
    ContactsAPIApi,
    Configuration,
    PublicContactCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)
let contactIdentifier: string; //The source id of contact obtained on contact create (default to undefined)
let publicContactCreateUpdatePayload: PublicContactCreateUpdatePayload; //

const { status, data } = await apiInstance.updateAContact(
    inboxIdentifier,
    contactIdentifier,
    publicContactCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **publicContactCreateUpdatePayload** | **PublicContactCreateUpdatePayload**|  | |
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|
| **contactIdentifier** | [**string**] | The source id of contact obtained on contact create | defaults to undefined|


### Return type

**PublicContact**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

