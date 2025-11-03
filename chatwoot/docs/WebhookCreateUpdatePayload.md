# WebhookCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**url** | **string** | The url where the events should be sent | [optional] [default to undefined]
**subscriptions** | **Array&lt;string&gt;** | The events you want to subscribe to. | [optional] [default to undefined]

## Example

```typescript
import { WebhookCreateUpdatePayload } from './api';

const instance: WebhookCreateUpdatePayload = {
    url,
    subscriptions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
