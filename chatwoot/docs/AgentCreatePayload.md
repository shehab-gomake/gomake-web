# AgentCreatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Full Name of the agent | [default to undefined]
**email** | **string** | Email of the Agent | [default to undefined]
**role** | **string** | Whether its administrator or agent | [default to undefined]
**availability_status** | **string** | The availability setting of the agent. | [optional] [default to undefined]
**auto_offline** | **boolean** | Whether the availability status of agent is configured to go offline automatically when away. | [optional] [default to undefined]

## Example

```typescript
import { AgentCreatePayload } from './api';

const instance: AgentCreatePayload = {
    name,
    email,
    role,
    availability_status,
    auto_offline,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
