# AuditLogsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAccountAuditLogs**](#getaccountauditlogs) | **GET** /api/v1/accounts/{account_id}/audit_logs | List Audit Logs in Account|

# **getAccountAuditLogs**
> GetAccountAuditLogs200Response getAccountAuditLogs()

Get Details of Audit Log entries for an Account. This endpoint is only available in Enterprise editions and requires the audit_logs feature to be enabled.

### Example

```typescript
import {
    AuditLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuditLogsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let page: number; //Page number for pagination (optional) (default to 1)

const { status, data } = await apiInstance.getAccountAuditLogs(
    accountId,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|


### Return type

**GetAccountAuditLogs200Response**

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
|**422** | Feature not enabled or not available in current plan |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

