# ContactCreatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**inbox_id** | **number** | ID of the inbox to which the contact belongs | [default to undefined]
**name** | **string** | name of the contact | [optional] [default to undefined]
**email** | **string** | email of the contact | [optional] [default to undefined]
**blocked** | **boolean** | whether the contact is blocked or not | [optional] [default to undefined]
**phone_number** | **string** | phone number of the contact | [optional] [default to undefined]
**avatar** | **File** | Send the form data with the avatar image binary or use the avatar_url | [optional] [default to undefined]
**avatar_url** | **string** | The url to a jpeg, png file for the contact avatar | [optional] [default to undefined]
**identifier** | **string** | A unique identifier for the contact in external system | [optional] [default to undefined]
**additional_attributes** | **object** | An object where you can store additional attributes for contact. example {\&quot;type\&quot;:\&quot;customer\&quot;, \&quot;age\&quot;:30} | [optional] [default to undefined]
**custom_attributes** | **object** | An object where you can store custom attributes for contact. example {\&quot;type\&quot;:\&quot;customer\&quot;, \&quot;age\&quot;:30}, this should have a valid custom attribute definition. | [optional] [default to undefined]

## Example

```typescript
import { ContactCreatePayload } from './api';

const instance: ContactCreatePayload = {
    inbox_id,
    name,
    email,
    blocked,
    phone_number,
    avatar,
    avatar_url,
    identifier,
    additional_attributes,
    custom_attributes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
