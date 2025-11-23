# PublicContact


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | Id of the contact | [optional] [default to undefined]
**source_id** | **string** | The session identifier of the contact | [optional] [default to undefined]
**name** | **string** | Name of the contact | [optional] [default to undefined]
**email** | **string** | Email of the contact | [optional] [default to undefined]
**pubsub_token** | **string** | The token to be used to connect to chatwoot websocket | [optional] [default to undefined]

## Example

```typescript
import { PublicContact } from './api';

const instance: PublicContact = {
    id,
    source_id,
    name,
    email,
    pubsub_token,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
