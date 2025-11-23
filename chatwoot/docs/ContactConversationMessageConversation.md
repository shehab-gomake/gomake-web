# ContactConversationMessageConversation

Conversation details

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**assignee_id** | **number** | ID of the assignee | [optional] [default to undefined]
**unread_count** | **number** | Count of unread messages | [optional] [default to undefined]
**last_activity_at** | **number** | Timestamp of last activity | [optional] [default to undefined]
**contact_inbox** | [**ContactConversationMessageConversationContactInbox**](ContactConversationMessageConversationContactInbox.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ContactConversationMessageConversation } from './api';

const instance: ContactConversationMessageConversation = {
    assignee_id,
    unread_count,
    last_activity_at,
    contact_inbox,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
