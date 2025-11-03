# ToggleStatusOfAConversationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **string** | The status of the conversation | [default to undefined]
**snoozed_until** | **number** | When status is &#x60;snoozed&#x60;, schedule the reopen time as a Unix timestamp in seconds. If not provided, the conversation is snoozed until the next customer reply. The conversation always reopens when the customer replies. | [optional] [default to undefined]

## Example

```typescript
import { ToggleStatusOfAConversationRequest } from './api';

const instance: ToggleStatusOfAConversationRequest = {
    status,
    snoozed_until,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
