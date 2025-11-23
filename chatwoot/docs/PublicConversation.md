# PublicConversation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | Id of the conversation | [optional] [default to undefined]
**inbox_id** | **string** | The inbox id of the conversation | [optional] [default to undefined]
**messages** | [**Array&lt;Message&gt;**](Message.md) | Messages in the conversation | [optional] [default to undefined]
**contact** | **object** | The contact information associated to the conversation | [optional] [default to undefined]

## Example

```typescript
import { PublicConversation } from './api';

const instance: PublicConversation = {
    id,
    inbox_id,
    messages,
    contact,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
