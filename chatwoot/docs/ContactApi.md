# ContactApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**contactInboxCreation**](#contactinboxcreation) | **POST** /api/v1/accounts/{account_id}/contacts/{id}/contact_inboxes | Create contact inbox|
|[**contactableInboxesGet**](#contactableinboxesget) | **GET** /api/v1/accounts/{account_id}/contacts/{id}/contactable_inboxes | Get Contactable Inboxes|

# **contactInboxCreation**
> ContactInboxes contactInboxCreation(contactInboxCreationRequest)

Create a contact inbox record for an inbox

### Example

```typescript
import {
    ContactApi,
    Configuration,
    ContactInboxCreationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the contact (default to undefined)
let contactInboxCreationRequest: ContactInboxCreationRequest; //

const { status, data } = await apiInstance.contactInboxCreation(
    accountId,
    id,
    contactInboxCreationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contactInboxCreationRequest** | **ContactInboxCreationRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | ID of the contact | defaults to undefined|


### Return type

**ContactInboxes**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Authentication error |  -  |
|**422** | Incorrect payload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactableInboxesGet**
> ContactableInboxesResponse contactableInboxesGet()

Get List of contactable Inboxes

### Example

```typescript
import {
    ContactApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the contact (default to undefined)

const { status, data } = await apiInstance.contactableInboxesGet(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | ID of the contact | defaults to undefined|


### Return type

**ContactableInboxesResponse**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**401** | Authentication error |  -  |
|**422** | Incorrect payload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

