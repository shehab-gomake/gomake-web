# ConversationMeta


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**labels** | **Array&lt;string&gt;** | Labels associated with the conversation | [optional] [default to undefined]
**additional_attributes** | [**ConversationMetaAdditionalAttributes**](ConversationMetaAdditionalAttributes.md) |  | [optional] [default to undefined]
**contact** | [**ContactDetail**](ContactDetail.md) |  | [optional] [default to undefined]
**agent_last_seen_at** | **string** | Timestamp when the agent last saw the conversation | [optional] [default to undefined]
**assignee_last_seen_at** | **string** | Timestamp when the assignee last saw the conversation | [optional] [default to undefined]

## Example

```typescript
import { ConversationMeta } from './api';

const instance: ConversationMeta = {
    labels,
    additional_attributes,
    contact,
    agent_last_seen_at,
    assignee_last_seen_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
