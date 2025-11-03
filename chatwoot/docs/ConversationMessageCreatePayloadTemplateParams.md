# ConversationMessageCreatePayloadTemplateParams

WhatsApp template parameters for sending structured messages

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the WhatsApp template (must be approved in WhatsApp Business Manager) | [default to undefined]
**category** | **string** | Category of the template | [default to undefined]
**language** | **string** | Language code of the template (BCP 47 format) | [default to undefined]
**processed_params** | [**ConversationMessageCreatePayloadTemplateParamsProcessedParams**](ConversationMessageCreatePayloadTemplateParamsProcessedParams.md) |  | [default to undefined]

## Example

```typescript
import { ConversationMessageCreatePayloadTemplateParams } from './api';

const instance: ConversationMessageCreatePayloadTemplateParams = {
    name,
    category,
    language,
    processed_params,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
