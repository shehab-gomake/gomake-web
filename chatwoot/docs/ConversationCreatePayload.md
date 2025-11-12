# ConversationCreatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**source_id** | **string** | Conversation source id | [default to undefined]
**inbox_id** | **number** | Id of inbox in which the conversation is created &lt;br/&gt; Allowed Inbox Types: Website, Phone, Api, Email | [default to undefined]
**contact_id** | **number** | Contact Id for which conversation is created | [optional] [default to undefined]
**additional_attributes** | **object** | Lets you specify attributes like browser information | [optional] [default to undefined]
**custom_attributes** | **object** | The object to save custom attributes for conversation, accepts custom attributes key and value | [optional] [default to undefined]
**status** | **string** | Specify the conversation whether it\&#39;s pending, open, closed | [optional] [default to undefined]
**assignee_id** | **number** | Agent Id for assigning a conversation to an agent | [optional] [default to undefined]
**team_id** | **number** | Team Id for assigning a conversation to a team\\ | [optional] [default to undefined]
**snoozed_until** | **string** | Snoozed until date time | [optional] [default to undefined]
**message** | [**ConversationCreatePayloadMessage**](ConversationCreatePayloadMessage.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ConversationCreatePayload } from './api';

const instance: ConversationCreatePayload = {
    source_id,
    inbox_id,
    contact_id,
    additional_attributes,
    custom_attributes,
    status,
    assignee_id,
    team_id,
    snoozed_until,
    message,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
