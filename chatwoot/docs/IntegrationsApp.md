# IntegrationsApp


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | The ID of the integration | [optional] [default to undefined]
**name** | **string** | The name of the integration | [optional] [default to undefined]
**description** | **string** | The description about the team | [optional] [default to undefined]
**hook_type** | **string** | Whether the integration is an account or inbox integration | [optional] [default to undefined]
**enabled** | **boolean** | Whether the integration is enabled for the account | [optional] [default to undefined]
**allow_multiple_hooks** | **boolean** | Whether multiple hooks can be created for the integration | [optional] [default to undefined]
**hooks** | **Array&lt;object&gt;** | If there are any hooks created for this integration | [optional] [default to undefined]

## Example

```typescript
import { IntegrationsApp } from './api';

const instance: IntegrationsApp = {
    id,
    name,
    description,
    hook_type,
    enabled,
    allow_multiple_hooks,
    hooks,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
