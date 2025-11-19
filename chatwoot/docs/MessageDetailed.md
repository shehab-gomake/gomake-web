# MessageDetailed


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | The ID of the message | [optional] [default to undefined]
**content** | **string** | The text content of the message | [optional] [default to undefined]
**inbox_id** | **number** | The ID of the inbox | [optional] [default to undefined]
**conversation_id** | **number** | The ID of the conversation | [optional] [default to undefined]
**message_type** | **number** | The type of the message (0: incoming, 1: outgoing, 2: activity, 3: template) | [optional] [default to undefined]
**content_type** | **string** | The type of the message content | [optional] [default to undefined]
**status** | **string** | The status of the message | [optional] [default to undefined]
**content_attributes** | [**MessageDetailedContentAttributes**](MessageDetailedContentAttributes.md) |  | [optional] [default to undefined]
**created_at** | **number** | The timestamp when message was created | [optional] [default to undefined]
**_private** | **boolean** | The flag which shows whether the message is private or not | [optional] [default to undefined]
**source_id** | **string** | The source ID of the message | [optional] [default to undefined]
**sender** | [**ContactDetail**](ContactDetail.md) |  | [optional] [default to undefined]

## Example

```typescript
import { MessageDetailed } from './api';

const instance: MessageDetailed = {
    id,
    content,
    inbox_id,
    conversation_id,
    message_type,
    content_type,
    status,
    content_attributes,
    created_at,
    _private,
    source_id,
    sender,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
