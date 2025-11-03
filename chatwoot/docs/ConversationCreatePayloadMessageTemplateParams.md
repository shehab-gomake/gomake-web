# ConversationCreatePayloadMessageTemplateParams

The template params for the message in case of whatsapp Channel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the template | [optional] [default to undefined]
**category** | **string** | Category of the template | [optional] [default to undefined]
**language** | **string** | Language of the template | [optional] [default to undefined]
**processed_params** | **object** | The processed param values for template variables in template | [optional] [default to undefined]

## Example

```typescript
import { ConversationCreatePayloadMessageTemplateParams } from './api';

const instance: ConversationCreatePayloadMessageTemplateParams = {
    name,
    category,
    language,
    processed_params,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
