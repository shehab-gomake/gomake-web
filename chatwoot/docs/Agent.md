# Agent


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**account_id** | **number** |  | [optional] [default to undefined]
**availability_status** | **string** | The availability status of the agent computed by Chatwoot. | [optional] [default to undefined]
**auto_offline** | **boolean** | Whether the availability status of agent is configured to go offline automatically when away. | [optional] [default to undefined]
**confirmed** | **boolean** | Whether the agent has confirmed their email address. | [optional] [default to undefined]
**email** | **string** | The email of the agent | [optional] [default to undefined]
**available_name** | **string** | The available name of the agent | [optional] [default to undefined]
**name** | **string** | The name of the agent | [optional] [default to undefined]
**role** | **string** | The role of the agent | [optional] [default to undefined]
**thumbnail** | **string** | The thumbnail of the agent | [optional] [default to undefined]
**custom_role_id** | **number** | The custom role id of the agent | [optional] [default to undefined]

## Example

```typescript
import { Agent } from './api';

const instance: Agent = {
    id,
    account_id,
    availability_status,
    auto_offline,
    confirmed,
    email,
    available_name,
    name,
    role,
    thumbnail,
    custom_role_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
