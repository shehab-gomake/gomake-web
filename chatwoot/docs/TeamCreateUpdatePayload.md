# TeamCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The name of the team | [optional] [default to undefined]
**description** | **string** | The description of the team | [optional] [default to undefined]
**allow_auto_assign** | **boolean** | If this setting is turned on, the system would automatically assign the conversation to an agent in the team while assigning the conversation to a team | [optional] [default to undefined]

## Example

```typescript
import { TeamCreateUpdatePayload } from './api';

const instance: TeamCreateUpdatePayload = {
    name,
    description,
    allow_auto_assign,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
