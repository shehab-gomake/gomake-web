# Team


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | The ID of the team | [optional] [default to undefined]
**name** | **string** | The name of the team | [optional] [default to undefined]
**description** | **string** | The description about the team | [optional] [default to undefined]
**allow_auto_assign** | **boolean** | If this setting is turned on, the system would automatically assign the conversation to an agent in the team while assigning the conversation to a team | [optional] [default to undefined]
**account_id** | **number** | The ID of the account with the team is a part of | [optional] [default to undefined]
**is_member** | **boolean** | This field shows whether the current user is a part of the team | [optional] [default to undefined]

## Example

```typescript
import { Team } from './api';

const instance: Team = {
    id,
    name,
    description,
    allow_auto_assign,
    account_id,
    is_member,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
