# IntegrationsHookCreatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**app_id** | **number** | The ID of app for which integration hook is being created | [optional] [default to undefined]
**inbox_id** | **number** | The inbox ID, if the hook is an inbox hook | [optional] [default to undefined]
**status** | **number** | The status of the integration (0 for inactive, 1 for active) | [optional] [default to undefined]
**settings** | **object** | The settings required by the integration | [optional] [default to undefined]

## Example

```typescript
import { IntegrationsHookCreatePayload } from './api';

const instance: IntegrationsHookCreatePayload = {
    app_id,
    inbox_id,
    status,
    settings,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
