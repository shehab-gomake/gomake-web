# TeamsApi

All URIs are relative to *https://app.chatwoot.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNewAgentToTeam**](#addnewagenttoteam) | **POST** /api/v1/accounts/{account_id}/teams/{team_id}/team_members | Add a New Agent|
|[**createATeam**](#createateam) | **POST** /api/v1/accounts/{account_id}/teams | Create a team|
|[**deleteATeam**](#deleteateam) | **DELETE** /api/v1/accounts/{account_id}/teams/{team_id} | Delete a team|
|[**deleteAgentInTeam**](#deleteagentinteam) | **DELETE** /api/v1/accounts/{account_id}/teams/{team_id}/team_members | Remove an Agent from Team|
|[**getDetailsOfASingleTeam**](#getdetailsofasingleteam) | **GET** /api/v1/accounts/{account_id}/teams/{team_id} | Get a team details|
|[**getTeamMembers**](#getteammembers) | **GET** /api/v1/accounts/{account_id}/teams/{team_id}/team_members | List Agents in Team|
|[**listAllTeams**](#listallteams) | **GET** /api/v1/accounts/{account_id}/teams | List all teams|
|[**updateATeam**](#updateateam) | **PATCH** /api/v1/accounts/{account_id}/teams/{team_id} | Update a team|
|[**updateAgentsInTeam**](#updateagentsinteam) | **PATCH** /api/v1/accounts/{account_id}/teams/{team_id}/team_members | Update Agents in Team|

# **addNewAgentToTeam**
> Array<Agent> addNewAgentToTeam(addNewAgentToTeamRequest)

Add a new Agent to Team

### Example

```typescript
import {
    TeamsApi,
    Configuration,
    AddNewAgentToTeamRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let teamId: number; //The ID of the team to be updated (default to undefined)
let addNewAgentToTeamRequest: AddNewAgentToTeamRequest; //

const { status, data } = await apiInstance.addNewAgentToTeam(
    accountId,
    teamId,
    addNewAgentToTeamRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addNewAgentToTeamRequest** | **AddNewAgentToTeamRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **teamId** | [**number**] | The ID of the team to be updated | defaults to undefined|


### Return type

**Array<Agent>**

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
|**404** | Team not found |  -  |
|**422** | User must exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createATeam**
> Team createATeam(teamCreateUpdatePayload)

Create a team in the account

### Example

```typescript
import {
    TeamsApi,
    Configuration,
    TeamCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let teamCreateUpdatePayload: TeamCreateUpdatePayload; //

const { status, data } = await apiInstance.createATeam(
    accountId,
    teamCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamCreateUpdatePayload** | **TeamCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Team**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteATeam**
> deleteATeam()

Delete a team from the account

### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let teamId: number; //The ID of the team to be updated (default to undefined)

const { status, data } = await apiInstance.deleteATeam(
    accountId,
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **teamId** | [**number**] | The ID of the team to be updated | defaults to undefined|


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
|**404** | The team does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAgentInTeam**
> deleteAgentInTeam(deleteAgentInTeamRequest)

Remove an Agent from Team

### Example

```typescript
import {
    TeamsApi,
    Configuration,
    DeleteAgentInTeamRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let teamId: number; //The ID of the team to be updated (default to undefined)
let deleteAgentInTeamRequest: DeleteAgentInTeamRequest; //

const { status, data } = await apiInstance.deleteAgentInTeam(
    accountId,
    teamId,
    deleteAgentInTeamRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deleteAgentInTeamRequest** | **DeleteAgentInTeamRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **teamId** | [**number**] | The ID of the team to be updated | defaults to undefined|


### Return type

void (empty response body)

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
|**404** | Team not found |  -  |
|**422** | User must exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDetailsOfASingleTeam**
> Team getDetailsOfASingleTeam()

Get the details of a team in the account

### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let teamId: number; //The ID of the team to be updated (default to undefined)

const { status, data } = await apiInstance.getDetailsOfASingleTeam(
    accountId,
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **teamId** | [**number**] | The ID of the team to be updated | defaults to undefined|


### Return type

**Team**

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
|**404** | The given team ID does not exist in the account |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTeamMembers**
> Array<Agent> getTeamMembers()

Get Details of Agents in an Team

### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let teamId: number; //The ID of the team to be updated (default to undefined)

const { status, data } = await apiInstance.getTeamMembers(
    accountId,
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **teamId** | [**number**] | The ID of the team to be updated | defaults to undefined|


### Return type

**Array<Agent>**

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
|**404** | Team not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listAllTeams**
> Array<Team> listAllTeams()

List all teams available in the current account

### Example

```typescript
import {
    TeamsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)

const { status, data } = await apiInstance.listAllTeams(
    accountId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|


### Return type

**Array<Team>**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateATeam**
> Team updateATeam(teamCreateUpdatePayload)

Update a team\'s attributes

### Example

```typescript
import {
    TeamsApi,
    Configuration,
    TeamCreateUpdatePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let teamId: number; //The ID of the team to be updated (default to undefined)
let teamCreateUpdatePayload: TeamCreateUpdatePayload; //

const { status, data } = await apiInstance.updateATeam(
    accountId,
    teamId,
    teamCreateUpdatePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamCreateUpdatePayload** | **TeamCreateUpdatePayload**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **teamId** | [**number**] | The ID of the team to be updated | defaults to undefined|


### Return type

**Team**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAgentsInTeam**
> Array<Agent> updateAgentsInTeam(addNewAgentToTeamRequest)

All agents except the one passed in params will be removed

### Example

```typescript
import {
    TeamsApi,
    Configuration,
    AddNewAgentToTeamRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamsApi(configuration);

let accountId: number; //The numeric ID of the account (default to undefined)
let teamId: number; //The ID of the team to be updated (default to undefined)
let addNewAgentToTeamRequest: AddNewAgentToTeamRequest; //

const { status, data } = await apiInstance.updateAgentsInTeam(
    accountId,
    teamId,
    addNewAgentToTeamRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addNewAgentToTeamRequest** | **AddNewAgentToTeamRequest**|  | |
| **accountId** | [**number**] | The numeric ID of the account | defaults to undefined|
| **teamId** | [**number**] | The ID of the team to be updated | defaults to undefined|


### Return type

**Array<Agent>**

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
|**404** | Team not found |  -  |
|**422** | User must exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

