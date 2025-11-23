# AuditLog


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | Unique identifier for the audit log entry | [optional] [default to undefined]
**auditable_id** | **number** | The ID of the audited object | [optional] [default to undefined]
**auditable_type** | **string** | The type of the audited object (e.g., Conversation, Contact, User) | [optional] [default to undefined]
**auditable** | **object** | The audited object data | [optional] [default to undefined]
**associated_id** | **number** | The ID of the associated object (typically the account ID) | [optional] [default to undefined]
**associated_type** | **string** | The type of the associated object | [optional] [default to undefined]
**user_id** | **number** | The ID of the user who performed the action | [optional] [default to undefined]
**user_type** | **string** | The type of user who performed the action | [optional] [default to undefined]
**username** | **string** | The email/username of the user who performed the action | [optional] [default to undefined]
**action** | **string** | The action performed on the object | [optional] [default to undefined]
**audited_changes** | **object** | JSON object containing the changes made to the audited object | [optional] [default to undefined]
**version** | **number** | Version number of the audit log entry | [optional] [default to undefined]
**comment** | **string** | Optional comment associated with the audit log entry | [optional] [default to undefined]
**request_uuid** | **string** | UUID to identify the request that generated this audit log | [optional] [default to undefined]
**created_at** | **number** | Unix timestamp when the audit log entry was created | [optional] [default to undefined]
**remote_address** | **string** | IP address from which the action was performed | [optional] [default to undefined]

## Example

```typescript
import { AuditLog } from './api';

const instance: AuditLog = {
    id,
    auditable_id,
    auditable_type,
    auditable,
    associated_id,
    associated_type,
    user_id,
    user_type,
    username,
    action,
    audited_changes,
    version,
    comment,
    request_uuid,
    created_at,
    remote_address,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
