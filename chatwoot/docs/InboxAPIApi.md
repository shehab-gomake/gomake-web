# InboxAPIApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getDetailsOfAInbox**](#getdetailsofainbox) | **GET** /public/api/v1/inboxes/{inbox_identifier} | Inbox details|

# **getDetailsOfAInbox**
> PublicInbox getDetailsOfAInbox()

Get the details of an inbox

### Example

```typescript
import {
    InboxAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InboxAPIApi(configuration);

let inboxIdentifier: string; //The identifier obtained from API inbox channel (default to undefined)

const { status, data } = await apiInstance.getDetailsOfAInbox(
    inboxIdentifier
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inboxIdentifier** | [**string**] | The identifier obtained from API inbox channel | defaults to undefined|


### Return type

**PublicInbox**

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
|**404** | The given inbox does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

