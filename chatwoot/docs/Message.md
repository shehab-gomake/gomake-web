# Message


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | The ID of the message | [optional] [default to undefined]
**content** | **string** | The text content of the message | [optional] [default to undefined]
**account_id** | **number** | The ID of the account | [optional] [default to undefined]
**inbox_id** | **number** | The ID of the inbox | [optional] [default to undefined]
**conversation_id** | **number** | The ID of the conversation | [optional] [default to undefined]
**message_type** | **number** | The type of the message | [optional] [default to undefined]
**created_at** | **number** | The time at which message was created | [optional] [default to undefined]
**updated_at** | **number** | The time at which message was updated | [optional] [default to undefined]
**_private** | **boolean** | The flags which shows whether the message is private or not | [optional] [default to undefined]
**status** | **string** | The status of the message | [optional] [default to undefined]
**source_id** | **string** | The source ID of the message | [optional] [default to undefined]
**content_type** | **string** | The type of the template message | [optional] [default to undefined]
**content_attributes** | **object** | The content attributes for each content_type | [optional] [default to undefined]
**sender_type** | **string** | The type of the sender | [optional] [default to undefined]
**sender_id** | **number** | The ID of the sender | [optional] [default to undefined]
**external_source_ids** | **object** | The external source IDs of the message | [optional] [default to undefined]
**additional_attributes** | **object** | The additional attributes of the message | [optional] [default to undefined]
**processed_message_content** | **string** | The processed message content | [optional] [default to undefined]
**sentiment** | **object** | The sentiment of the message | [optional] [default to undefined]
**conversation** | **object** | The conversation object | [optional] [default to undefined]
**attachment** | **object** | The file object attached to the image | [optional] [default to undefined]
**sender** | **object** | User/Agent/AgentBot object | [optional] [default to undefined]

## Example

```typescript
import { Message } from './api';

const instance: Message = {
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
    attachment,
    sender,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
