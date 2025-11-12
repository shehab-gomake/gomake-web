# UserCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the user | [optional] [default to undefined]
**display_name** | **string** | Display name of the user | [optional] [default to undefined]
**email** | **string** | Email of the user | [optional] [default to undefined]
**password** | **string** | Password must contain uppercase, lowercase letters, number and a special character | [optional] [default to undefined]
**custom_attributes** | **object** | Custom attributes you want to associate with the user | [optional] [default to undefined]

## Example

```typescript
import { UserCreateUpdatePayload } from './api';

const instance: UserCreateUpdatePayload = {
    name,
    display_name,
    email,
    password,
    custom_attributes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
