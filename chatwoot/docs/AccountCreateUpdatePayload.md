# AccountCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the account | [optional] [default to undefined]
**locale** | **string** | The locale of the account | [optional] [default to undefined]
**domain** | **string** | The domain of the account | [optional] [default to undefined]
**support_email** | **string** | The support email of the account | [optional] [default to undefined]
**status** | **string** | The status of the account | [optional] [default to undefined]
**limits** | **object** | The limits of the account | [optional] [default to undefined]
**custom_attributes** | **object** | The custom attributes of the account | [optional] [default to undefined]

## Example

```typescript
import { AccountCreateUpdatePayload } from './api';

const instance: AccountCreateUpdatePayload = {
    name,
    locale,
    domain,
    support_email,
    status,
    limits,
    custom_attributes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
