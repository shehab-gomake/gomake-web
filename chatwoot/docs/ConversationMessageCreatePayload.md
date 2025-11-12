# ConversationMessageCreatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** | The content of the message | [default to undefined]
**message_type** | **string** | The type of the message | [optional] [default to undefined]
**_private** | **boolean** | Flag to identify if it is a private note | [optional] [default to undefined]
**content_type** | **string** | Content type of the message | [optional] [default to undefined]
**content_attributes** | **object** | Attributes based on the content type | [optional] [default to undefined]
**campaign_id** | **number** | The campaign id to which the message belongs | [optional] [default to undefined]
**template_params** | [**ConversationMessageCreatePayloadTemplateParams**](ConversationMessageCreatePayloadTemplateParams.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ConversationMessageCreatePayload } from './api';

const instance: ConversationMessageCreatePayload = {
    content,
    message_type,
    _private,
    content_type,
    content_attributes,
    campaign_id,
    template_params,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
