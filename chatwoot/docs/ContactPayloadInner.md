# ContactPayloadInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**additional_attributes** | **object** | The object containing additional attributes related to the contact | [optional] [default to undefined]
**availability_status** | **string** | The availability status of the contact | [optional] [default to undefined]
**email** | **string** | The email address of the contact | [optional] [default to undefined]
**id** | **number** | The ID of the contact | [optional] [default to undefined]
**name** | **string** | The name of the contact | [optional] [default to undefined]
**phone_number** | **string** | The phone number of the contact | [optional] [default to undefined]
**blocked** | **boolean** | Whether the contact is blocked | [optional] [default to undefined]
**identifier** | **string** | The identifier of the contact | [optional] [default to undefined]
**thumbnail** | **string** | The thumbnail of the contact | [optional] [default to undefined]
**custom_attributes** | **object** | The custom attributes of the contact | [optional] [default to undefined]
**last_activity_at** | **number** | The last activity at of the contact | [optional] [default to undefined]
**created_at** | **number** | The created at of the contact | [optional] [default to undefined]
**contact_inboxes** | [**Array&lt;ContactInboxes&gt;**](ContactInboxes.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ContactPayloadInner } from './api';

const instance: ContactPayloadInner = {
    additional_attributes,
    availability_status,
    email,
    id,
    name,
    phone_number,
    blocked,
    identifier,
    thumbnail,
    custom_attributes,
    last_activity_at,
    created_at,
    contact_inboxes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
