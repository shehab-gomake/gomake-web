# User


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**access_token** | **string** |  | [optional] [default to undefined]
**account_id** | **number** |  | [optional] [default to undefined]
**available_name** | **string** |  | [optional] [default to undefined]
**avatar_url** | **string** |  | [optional] [default to undefined]
**confirmed** | **boolean** |  | [optional] [default to undefined]
**display_name** | **string** |  | [optional] [default to undefined]
**message_signature** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**hmac_identifier** | **string** |  | [optional] [default to undefined]
**inviter_id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**provider** | **string** |  | [optional] [default to undefined]
**pubsub_token** | **string** |  | [optional] [default to undefined]
**role** | **string** |  | [optional] [default to undefined]
**ui_settings** | **object** |  | [optional] [default to undefined]
**uid** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**custom_attributes** | **object** | Available for users who are created through platform APIs and has custom attributes associated. | [optional] [default to undefined]
**accounts** | [**Array&lt;UserAccountsInner&gt;**](UserAccountsInner.md) |  | [optional] [default to undefined]

## Example

```typescript
import { User } from './api';

const instance: User = {
    id,
    access_token,
    account_id,
    available_name,
    avatar_url,
    confirmed,
    display_name,
    message_signature,
    email,
    hmac_identifier,
    inviter_id,
    name,
    provider,
    pubsub_token,
    role,
    ui_settings,
    uid,
    type,
    custom_attributes,
    accounts,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
