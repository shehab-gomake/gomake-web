# AccountUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the account | [optional] [default to undefined]
**locale** | **string** | The locale of the account | [optional] [default to undefined]
**domain** | **string** | The domain of the account | [optional] [default to undefined]
**support_email** | **string** | The support email of the account | [optional] [default to undefined]
**auto_resolve_after** | **number** | Auto resolve conversations after specified minutes | [optional] [default to undefined]
**auto_resolve_message** | **string** | Message to send when auto resolving | [optional] [default to undefined]
**auto_resolve_ignore_waiting** | **boolean** | Whether to ignore waiting conversations for auto resolve | [optional] [default to undefined]
**industry** | **string** | Industry type | [optional] [default to undefined]
**company_size** | **string** | Company size | [optional] [default to undefined]
**timezone** | **string** | Account timezone | [optional] [default to undefined]

## Example

```typescript
import { AccountUpdatePayload } from './api';

const instance: AccountUpdatePayload = {
    name,
    locale,
    domain,
    support_email,
    auto_resolve_after,
    auto_resolve_message,
    auto_resolve_ignore_waiting,
    industry,
    company_size,
    timezone,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
