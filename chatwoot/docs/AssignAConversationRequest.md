# AssignAConversationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**assignee_id** | **number** | Id of the assignee user | [optional] [default to undefined]
**team_id** | **number** | Id of the team. If the assignee_id is present, this param would be ignored | [optional] [default to undefined]

## Example

```typescript
import { AssignAConversationRequest } from './api';

const instance: AssignAConversationRequest = {
    assignee_id,
    team_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
