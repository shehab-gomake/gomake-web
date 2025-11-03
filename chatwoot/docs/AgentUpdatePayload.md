# AgentUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**role** | **string** | Whether its administrator or agent | [default to undefined]
**availability_status** | **string** | The availability status of the agent. | [optional] [default to undefined]
**auto_offline** | **boolean** | Whether the availability status of agent is configured to go offline automatically when away. | [optional] [default to undefined]

## Example

```typescript
import { AgentUpdatePayload } from './api';

const instance: AgentUpdatePayload = {
    role,
    availability_status,
    auto_offline,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
