# ConversationShowAllOfMeta


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sender** | [**ConversationShowAllOfMetaSender**](ConversationShowAllOfMetaSender.md) |  | [optional] [default to undefined]
**channel** | **string** | Channel Type | [optional] [default to undefined]
**assignee** | [**User**](User.md) |  | [optional] [default to undefined]
**hmac_verified** | **boolean** | Whether the hmac is verified | [optional] [default to undefined]

## Example

```typescript
import { ConversationShowAllOfMeta } from './api';

const instance: ConversationShowAllOfMeta = {
    sender,
    channel,
    assignee,
    hmac_verified,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
