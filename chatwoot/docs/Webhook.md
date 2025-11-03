# Webhook


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | The ID of the webhook | [optional] [default to undefined]
**url** | **string** | The url to which the events will be send | [optional] [default to undefined]
**subscriptions** | **Array&lt;string&gt;** | The list of subscribed events | [optional] [default to undefined]
**account_id** | **number** | The id of the account which the webhook object belongs to | [optional] [default to undefined]

## Example

```typescript
import { Webhook } from './api';

const instance: Webhook = {
    id,
    url,
    subscriptions,
    account_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
