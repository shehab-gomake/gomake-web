# CSATSurveyPageApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCsatSurveyPage**](#getcsatsurveypage) | **GET** /survey/responses/{conversation_uuid} | Get CSAT survey page|

# **getCsatSurveyPage**
> getCsatSurveyPage()

You can redirect the client to this URL, instead of implementing the CSAT survey component yourself.

### Example

```typescript
import {
    CSATSurveyPageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CSATSurveyPageApi(configuration);

let conversationUuid: number; //The uuid of the conversation (default to undefined)

const { status, data } = await apiInstance.getCsatSurveyPage(
    conversationUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationUuid** | [**number**] | The uuid of the conversation | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

