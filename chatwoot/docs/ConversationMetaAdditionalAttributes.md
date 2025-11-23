# ConversationMetaAdditionalAttributes

Additional attributes of the conversation

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**browser** | [**ConversationMetaAdditionalAttributesBrowser**](ConversationMetaAdditionalAttributesBrowser.md) |  | [optional] [default to undefined]
**referer** | **string** | Referrer URL | [optional] [default to undefined]
**initiated_at** | [**ConversationMetaAdditionalAttributesInitiatedAt**](ConversationMetaAdditionalAttributesInitiatedAt.md) |  | [optional] [default to undefined]
**browser_language** | **string** | Browser language setting | [optional] [default to undefined]
**conversation_language** | **string** | Conversation language | [optional] [default to undefined]

## Example

```typescript
import { ConversationMetaAdditionalAttributes } from './api';

const instance: ConversationMetaAdditionalAttributes = {
    browser,
    referer,
    initiated_at,
    browser_language,
    conversation_language,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
