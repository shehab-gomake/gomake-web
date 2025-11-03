# ContactsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**contactConversations**](#contactconversations) | **GET** /api/v1/accounts/{account_id}/contacts/{id}/conversations | Contact Conversations|
|[**contactCreate**](#contactcreate) | **POST** /api/v1/accounts/{account_id}/contacts | Create Contact|
|[**contactDelete**](#contactdelete) | **DELETE** /api/v1/accounts/{account_id}/contacts/{id} | Delete Contact|
|[**contactDetails**](#contactdetails) | **GET** /api/v1/accounts/{account_id}/contacts/{id} | Show Contact|
|[**contactFilter**](#contactfilter) | **POST** /api/v1/accounts/{account_id}/contacts/filter | Contact Filter|
|[**contactList**](#contactlist) | **GET** /api/v1/accounts/{account_id}/contacts | List Contacts|
|[**contactSearch**](#contactsearch) | **GET** /api/v1/accounts/{account_id}/contacts/search | Search Contacts|
|[**contactUpdate**](#contactupdate) | **PUT** /api/v1/accounts/{account_id}/contacts/{id} | Update Contact|

# **contactConversations**
> ContactConversationsResponse contactConversations()

Get conversations associated with that contact

### Example

```typescript
import {
    ContactsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the contact (default to undefined)

const { status, data } = await apiInstance.contactConversations(
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

**ContactConversationsResponse**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Contact not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactCreate**
> ExtendedContact contactCreate(contactCreatePayload)

Create a new Contact

### Example

```typescript
import {
    ContactsApi,
    Configuration,
    ContactCreatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let contactCreatePayload: ContactCreatePayload; //

const { status, data } = await apiInstance.contactCreate(
    accountId,
    contactCreatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contactCreatePayload** | **ContactCreatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**ExtendedContact**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Bad Request Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactDelete**
> contactDelete()

Delete a contact belonging to the account using ID

### Example

```typescript
import {
    ContactsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the contact (default to undefined)

const { status, data } = await apiInstance.contactDelete(
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
|**404** | Contact not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactDetails**
> ContactShowResponse contactDetails()

Get a contact belonging to the account using ID

### Example

```typescript
import {
    ContactsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the contact (default to undefined)

const { status, data } = await apiInstance.contactDetails(
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

**ContactShowResponse**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**404** | Contact not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactFilter**
> ContactsListResponse contactFilter(contactFilterRequest)

Filter contacts with custom filter options and pagination

### Example

```typescript
import {
    ContactsApi,
    Configuration,
    ContactFilterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let contactFilterRequest: ContactFilterRequest; //
let page: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.contactFilter(
    accountId,
    contactFilterRequest,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contactFilterRequest** | **ContactFilterRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ContactsListResponse**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Bad Request Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactList**
> ContactsListResponse contactList()

Listing all the resolved contacts with pagination (Page size = 15). Resolved contacts are the ones with a value for identifier, email or phone number

### Example

```typescript
import {
    ContactsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let sort: 'name' | 'email' | 'phone_number' | 'last_activity_at' | '-name' | '-email' | '-phone_number' | '-last_activity_at'; //The attribute by which list should be sorted (optional) (default to undefined)
let page: number; //The page parameter (optional) (default to 1)

const { status, data } = await apiInstance.contactList(
    accountId,
    sort,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **sort** | [**&#39;name&#39; | &#39;email&#39; | &#39;phone_number&#39; | &#39;last_activity_at&#39; | &#39;-name&#39; | &#39;-email&#39; | &#39;-phone_number&#39; | &#39;-last_activity_at&#39;**]**Array<&#39;name&#39; &#124; &#39;email&#39; &#124; &#39;phone_number&#39; &#124; &#39;last_activity_at&#39; &#124; &#39;-name&#39; &#124; &#39;-email&#39; &#124; &#39;-phone_number&#39; &#124; &#39;-last_activity_at&#39;>** | The attribute by which list should be sorted | (optional) defaults to undefined|
| **page** | [**number**] | The page parameter | (optional) defaults to 1|


### Return type

**ContactsListResponse**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Bad Request Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactSearch**
> ContactsListResponse contactSearch()

Search the resolved contacts using a search key, currently supports email search (Page size = 15). Resolved contacts are the ones with a value for identifier, email or phone number

### Example

```typescript
import {
    ContactsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let q: string; //Search using contact `name`, `identifier`, `email` or `phone number` (optional) (default to undefined)
let sort: 'name' | 'email' | 'phone_number' | 'last_activity_at' | '-name' | '-email' | '-phone_number' | '-last_activity_at'; //The attribute by which list should be sorted (optional) (default to undefined)
let page: number; //The page parameter (optional) (default to 1)

const { status, data } = await apiInstance.contactSearch(
    accountId,
    q,
    sort,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **q** | [**string**] | Search using contact &#x60;name&#x60;, &#x60;identifier&#x60;, &#x60;email&#x60; or &#x60;phone number&#x60; | (optional) defaults to undefined|
| **sort** | [**&#39;name&#39; | &#39;email&#39; | &#39;phone_number&#39; | &#39;last_activity_at&#39; | &#39;-name&#39; | &#39;-email&#39; | &#39;-phone_number&#39; | &#39;-last_activity_at&#39;**]**Array<&#39;name&#39; &#124; &#39;email&#39; &#124; &#39;phone_number&#39; &#124; &#39;last_activity_at&#39; &#124; &#39;-name&#39; &#124; &#39;-email&#39; &#124; &#39;-phone_number&#39; &#124; &#39;-last_activity_at&#39;>** | The attribute by which list should be sorted | (optional) defaults to undefined|
| **page** | [**number**] | The page parameter | (optional) defaults to 1|


### Return type

**ContactsListResponse**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactUpdate**
> ContactBase contactUpdate(contactUpdatePayload)

Update a contact belonging to the account using ID

### Example

```typescript
import {
    ContactsApi,
    Configuration,
    ContactUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //ID of the contact (default to undefined)
let contactUpdatePayload: ContactUpdatePayload; //

const { status, data } = await apiInstance.contactUpdate(
    accountId,
    id,
    contactUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contactUpdatePayload** | **ContactUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | ID of the contact | defaults to undefined|


### Return type

**ContactBase**

### Authorization

[userApiKey](../README.md#userApiKey)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Success |  -  |
|**404** | Contact not found |  -  |
|**403** | Access denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

