# PublicMessage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Id of the message | [optional] [default to undefined]
**content** | **string** | Text content of the message | [optional] [default to undefined]
**message_type** | **string** | Denotes the message type | [optional] [default to undefined]
**content_type** | **string** | Content type of the message | [optional] [default to undefined]
**content_attributes** | **string** | Additional content attributes of the message | [optional] [default to undefined]
**created_at** | **string** | Created at time stamp of the message | [optional] [default to undefined]
**conversation_id** | **string** | Conversation Id of the message | [optional] [default to undefined]
**attachments** | **Array&lt;object&gt;** | Attachments if any | [optional] [default to undefined]
**sender** | **object** | Details of the sender | [optional] [default to undefined]

## Example

```typescript
import { PublicMessage } from './api';

const instance: PublicMessage = {
    id,
    content,
    message_type,
    content_type,
    content_attributes,
    created_at,
    conversation_id,
    attachments,
    sender,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
