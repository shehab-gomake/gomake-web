# ContactConversationMessage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | ID of the message | [optional] [default to undefined]
**content** | **string** | Content of the message | [optional] [default to undefined]
**account_id** | **number** | ID of the account | [optional] [default to undefined]
**inbox_id** | **number** | ID of the inbox | [optional] [default to undefined]
**conversation_id** | **number** | ID of the conversation | [optional] [default to undefined]
**message_type** | **number** | Type of the message | [optional] [default to undefined]
**created_at** | **number** | Timestamp when message was created | [optional] [default to undefined]
**updated_at** | **string** | Formatted datetime when message was updated | [optional] [default to undefined]
**_private** | **boolean** | Whether the message is private | [optional] [default to undefined]
**status** | **string** | Status of the message | [optional] [default to undefined]
**source_id** | **string** | Source ID of the message | [optional] [default to undefined]
**content_type** | **string** | Type of the content | [optional] [default to undefined]
**content_attributes** | **object** | Attributes of the content | [optional] [default to undefined]
**sender_type** | **string** | Type of the sender | [optional] [default to undefined]
**sender_id** | **number** | ID of the sender | [optional] [default to undefined]
**external_source_ids** | **object** | External source IDs | [optional] [default to undefined]
**additional_attributes** | **object** | Additional attributes of the message | [optional] [default to undefined]
**processed_message_content** | **string** | Processed message content | [optional] [default to undefined]
**sentiment** | **object** | Sentiment analysis of the message | [optional] [default to undefined]
**conversation** | [**ContactConversationMessageConversation**](ContactConversationMessageConversation.md) |  | [optional] [default to undefined]
**sender** | [**ContactConversationMessageSender**](ContactConversationMessageSender.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ContactConversationMessage } from './api';

const instance: ContactConversationMessage = {
    id,
    content,
    account_id,
    inbox_id,
    conversation_id,
    message_type,
    created_at,
    updated_at,
    _private,
    status,
    source_id,
    content_type,
    content_attributes,
    sender_type,
    sender_id,
    external_source_ids,
    additional_attributes,
    processed_message_content,
    sentiment,
    conversation,
    sender,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
