# AccountDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | Account ID | [optional] [default to undefined]
**name** | **string** | Name of the account | [optional] [default to undefined]
**locale** | **string** | The locale of the account | [optional] [default to undefined]
**domain** | **string** | The domain of the account | [optional] [default to undefined]
**support_email** | **string** | The support email of the account | [optional] [default to undefined]
**status** | **string** | The status of the account | [optional] [default to undefined]
**created_at** | **string** | The creation date of the account | [optional] [default to undefined]
**cache_keys** | **object** | Cache keys for the account | [optional] [default to undefined]
**features** | **Array&lt;string&gt;** | Enabled features for the account | [optional] [default to undefined]
**settings** | [**AccountDetailSettings**](AccountDetailSettings.md) |  | [optional] [default to undefined]
**custom_attributes** | [**AccountDetailCustomAttributes**](AccountDetailCustomAttributes.md) |  | [optional] [default to undefined]

## Example

```typescript
import { AccountDetail } from './api';

const instance: AccountDetail = {
    id,
    name,
    locale,
    domain,
    support_email,
    status,
    created_at,
    cache_keys,
    features,
    settings,
    custom_attributes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
