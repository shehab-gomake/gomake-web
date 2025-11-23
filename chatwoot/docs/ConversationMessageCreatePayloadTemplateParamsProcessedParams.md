# ConversationMessageCreatePayloadTemplateParamsProcessedParams

Processed template parameters organized by component type

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**body** | **{ [key: string]: string; }** | Body component parameters with variable placeholders | [optional] [default to undefined]
**header** | [**ConversationMessageCreatePayloadTemplateParamsProcessedParamsHeader**](ConversationMessageCreatePayloadTemplateParamsProcessedParamsHeader.md) |  | [optional] [default to undefined]
**buttons** | [**Array&lt;ConversationMessageCreatePayloadTemplateParamsProcessedParamsButtonsInner&gt;**](ConversationMessageCreatePayloadTemplateParamsProcessedParamsButtonsInner.md) | Button component parameters for interactive templates | [optional] [default to undefined]

## Example

```typescript
import { ConversationMessageCreatePayloadTemplateParamsProcessedParams } from './api';

const instance: ConversationMessageCreatePayloadTemplateParamsProcessedParams = {
    body,
    header,
    buttons,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
