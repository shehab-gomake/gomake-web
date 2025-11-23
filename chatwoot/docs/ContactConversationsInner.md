# ContactConversationsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | ID of the conversation | [optional] [default to undefined]
**messages** | [**Array&lt;Message&gt;**](Message.md) |  | [optional] [default to undefined]
**account_id** | **number** | Account Id | [optional] [default to undefined]
**uuid** | **string** | UUID of the conversation | [optional] [default to undefined]
**additional_attributes** | **object** | The object containing additional attributes related to the conversation | [optional] [default to undefined]
**agent_last_seen_at** | **number** | The last activity at of the agent | [optional] [default to undefined]
**assignee_last_seen_at** | **number** | The last activity at of the assignee | [optional] [default to undefined]
**can_reply** | **boolean** | Whether the conversation can be replied to | [optional] [default to undefined]
**contact_last_seen_at** | **number** | The last activity at of the contact | [optional] [default to undefined]
**custom_attributes** | **object** | The object to save custom attributes for conversation, accepts custom attributes key and value | [optional] [default to undefined]
**inbox_id** | **number** | ID of the inbox | [optional] [default to undefined]
**labels** | **Array&lt;string&gt;** | The labels of the conversation | [optional] [default to undefined]
**muted** | **boolean** | Whether the conversation is muted | [optional] [default to undefined]
**snoozed_until** | **number** | The time at which the conversation will be unmuted | [optional] [default to undefined]
**status** | **string** | The status of the conversation | [optional] [default to undefined]
**created_at** | **number** | The time at which conversation was created | [optional] [default to undefined]
**updated_at** | **number** | The time at which conversation was updated | [optional] [default to undefined]
**timestamp** | **string** | The time at which conversation was created | [optional] [default to undefined]
**first_reply_created_at** | **number** | The time at which the first reply was created | [optional] [default to undefined]
**unread_count** | **number** | The number of unread messages | [optional] [default to undefined]
**last_non_activity_message** | [**Message**](Message.md) |  | [optional] [default to undefined]
**last_activity_at** | **number** | The last activity at of the conversation | [optional] [default to undefined]
**priority** | **string** | The priority of the conversation | [optional] [default to undefined]
**waiting_since** | **number** | The time at which the conversation was waiting | [optional] [default to undefined]
**sla_policy_id** | **number** | The ID of the SLA policy | [optional] [default to undefined]
**applied_sla** | **object** | The applied SLA | [optional] [default to undefined]
**sla_events** | **Array&lt;object&gt;** |  | [optional] [default to undefined]
**meta** | [**ContactConversationsInnerAllOfMeta**](ContactConversationsInnerAllOfMeta.md) |  | [optional] [default to undefined]
**display_id** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ContactConversationsInner } from './api';

const instance: ContactConversationsInner = {
    id,
    messages,
    account_id,
    uuid,
    additional_attributes,
    agent_last_seen_at,
    assignee_last_seen_at,
    can_reply,
    contact_last_seen_at,
    custom_attributes,
    inbox_id,
    labels,
    muted,
    snoozed_until,
    status,
    created_at,
    updated_at,
    timestamp,
    first_reply_created_at,
    unread_count,
    last_non_activity_message,
    last_activity_at,
    priority,
    waiting_since,
    sla_policy_id,
    applied_sla,
    sla_events,
    meta,
    display_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
