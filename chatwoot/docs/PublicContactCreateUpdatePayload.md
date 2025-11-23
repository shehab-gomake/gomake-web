# PublicContactCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identifier** | **string** | External identifier of the contact | [optional] [default to undefined]
**identifier_hash** | **string** | Identifier hash prepared for HMAC authentication | [optional] [default to undefined]
**email** | **string** | Email of the contact | [optional] [default to undefined]
**name** | **string** | Name of the contact | [optional] [default to undefined]
**phone_number** | **string** | Phone number of the contact | [optional] [default to undefined]
**avatar** | **File** | Send the form data with the avatar image binary or use the avatar_url | [optional] [default to undefined]
**custom_attributes** | **object** | Custom attributes of the customer | [optional] [default to undefined]

## Example

```typescript
import { PublicContactCreateUpdatePayload } from './api';

const instance: PublicContactCreateUpdatePayload = {
    identifier,
    identifier_hash,
    email,
    name,
    phone_number,
    avatar,
    custom_attributes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
