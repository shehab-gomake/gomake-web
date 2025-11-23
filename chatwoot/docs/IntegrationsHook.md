# IntegrationsHook


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | The ID of the integration hook | [optional] [default to undefined]
**app_id** | **string** | The ID of the integration app | [optional] [default to undefined]
**inbox_id** | **string** | Inbox ID if its an Inbox integration | [optional] [default to undefined]
**account_id** | **string** | Account ID of the integration | [optional] [default to undefined]
**status** | **boolean** | Whether the integration hook is enabled for the account | [optional] [default to undefined]
**hook_type** | **boolean** | Whether its an account or inbox integration hook | [optional] [default to undefined]
**settings** | **object** | The associated settings for the integration | [optional] [default to undefined]

## Example

```typescript
import { IntegrationsHook } from './api';

const instance: IntegrationsHook = {
    id,
    app_id,
    inbox_id,
    account_id,
    status,
    hook_type,
    settings,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
