# ContactLabelsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**contactAddLabels**](#contactaddlabels) | **POST** /api/v1/accounts/{account_id}/contacts/{id}/labels | Add Labels|
|[**listAllLabelsOfAContact**](#listalllabelsofacontact) | **GET** /api/v1/accounts/{account_id}/contacts/{id}/labels | List Labels|

# **contactAddLabels**
> ContactLabels contactAddLabels(contactAddLabelsRequest)

Add labels to a contact. Note that this API would overwrite the existing list of labels associated to the conversation.

### Example

```typescript
import {
    ContactLabelsApi,
    Configuration,
    ContactAddLabelsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactLabelsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the contact (default to undefined)
let contactAddLabelsRequest: ContactAddLabelsRequest; //

const { status, data } = await apiInstance.contactAddLabels(
    accountId,
    id,
    contactAddLabelsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contactAddLabelsRequest** | **ContactAddLabelsRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | ID of the contact | defaults to undefined|


### Return type

**ContactLabels**

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
|**404** | Contact not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllLabelsOfAContact**
> ContactLabels listAllLabelsOfAContact()

Lists all the labels of a contact

### Example

```typescript
import {
    ContactLabelsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactLabelsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the contact (default to undefined)

const { status, data } = await apiInstance.listAllLabelsOfAContact(
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

**ContactLabels**

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
|**404** | Contact not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

