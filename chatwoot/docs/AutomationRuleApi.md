# AutomationRuleApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNewAutomationRuleToAccount**](#addnewautomationruletoaccount) | **POST** /api/v1/accounts/{account_id}/automation_rules | Add a new automation rule|
|[**deleteAutomationRuleFromAccount**](#deleteautomationrulefromaccount) | **DELETE** /api/v1/accounts/{account_id}/automation_rules/{id} | Remove a automation rule from account|
|[**getAccountAutomationRule**](#getaccountautomationrule) | **GET** /api/v1/accounts/{account_id}/automation_rules | List all automation rules in an account|
|[**getDetailsOfASingleAutomationRule**](#getdetailsofasingleautomationrule) | **GET** /api/v1/accounts/{account_id}/automation_rules/{id} | Get a automation rule details|
|[**updateAutomationRuleInAccount**](#updateautomationruleinaccount) | **PATCH** /api/v1/accounts/{account_id}/automation_rules/{id} | Update automation rule in Account|

# **addNewAutomationRuleToAccount**
> AutomationRule addNewAutomationRuleToAccount(automationRuleCreateUpdatePayload)

Add a new automation rule to account

### Example

```typescript
import {
    AutomationRuleApi,
    Configuration,
    AutomationRuleCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AutomationRuleApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let automationRuleCreateUpdatePayload: AutomationRuleCreateUpdatePayload; //

const { status, data } = await apiInstance.addNewAutomationRuleToAccount(
    accountId,
    automationRuleCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **automationRuleCreateUpdatePayload** | **AutomationRuleCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**AutomationRule**

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

# **deleteAutomationRuleFromAccount**
> deleteAutomationRuleFromAccount()

Remove a automation rule from account

### Example

```typescript
import {
    AutomationRuleApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AutomationRuleApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the automation rule to be deleted (default to undefined)

const { status, data } = await apiInstance.deleteAutomationRuleFromAccount(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the automation rule to be deleted | defaults to undefined|


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
|**403** | Access denied |  -  |
|**404** | automation rule not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAccountAutomationRule**
> AutomationRule getAccountAutomationRule()

Get details of automation rules in an Account

### Example

```typescript
import {
    AutomationRuleApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AutomationRuleApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let page: number; //The page parameter (optional) (default to 1)

const { status, data } = await apiInstance.getAccountAutomationRule(
    accountId,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **page** | [**number**] | The page parameter | (optional) defaults to 1|


### Return type

**AutomationRule**

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

# **getDetailsOfASingleAutomationRule**
> AutomationRule getDetailsOfASingleAutomationRule()

Get the details of a automation rule in the account

### Example

```typescript
import {
    AutomationRuleApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AutomationRuleApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the automation rule to be updated. (default to undefined)

const { status, data } = await apiInstance.getDetailsOfASingleAutomationRule(
    accountId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the automation rule to be updated. | defaults to undefined|


### Return type

**AutomationRule**

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
|**404** | The given rule ID does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAutomationRuleInAccount**
> AutomationRule updateAutomationRuleInAccount(automationRuleCreateUpdatePayload)

Update a automation rule in account

### Example

```typescript
import {
    AutomationRuleApi,
    Configuration,
    AutomationRuleCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new AutomationRuleApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let id: number; //The ID of the automation rule to be updated. (default to undefined)
let automationRuleCreateUpdatePayload: AutomationRuleCreateUpdatePayload; //

const { status, data } = await apiInstance.updateAutomationRuleInAccount(
    accountId,
    id,
    automationRuleCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **automationRuleCreateUpdatePayload** | **AutomationRuleCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **id** | [**number**] | The ID of the automation rule to be updated. | defaults to undefined|


### Return type

**AutomationRule**

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
|**404** | Rule not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

