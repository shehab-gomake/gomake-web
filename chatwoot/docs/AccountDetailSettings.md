# AccountDetailSettings

Account settings

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**auto_resolve_after** | **number** | Auto resolve conversations after specified minutes | [optional] [default to undefined]
**auto_resolve_message** | **string** | Message to send when auto resolving | [optional] [default to undefined]
**auto_resolve_ignore_waiting** | **boolean** | Whether to ignore waiting conversations for auto resolve | [optional] [default to undefined]

## Example

```typescript
import { AccountDetailSettings } from './api';

const instance: AccountDetailSettings = {
    auto_resolve_after,
    auto_resolve_message,
    auto_resolve_ignore_waiting,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
