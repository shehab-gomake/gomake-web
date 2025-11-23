# GetAccountAuditLogs200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**per_page** | **number** | Number of items per page | [optional] [default to undefined]
**total_entries** | **number** | Total number of audit log entries | [optional] [default to undefined]
**current_page** | **number** | Current page number | [optional] [default to undefined]
**audit_logs** | [**Array&lt;AuditLog&gt;**](AuditLog.md) | Array of audit log entries | [optional] [default to undefined]

## Example

```typescript
import { GetAccountAuditLogs200Response } from './api';

const instance: GetAccountAuditLogs200Response = {
    per_page,
    total_entries,
    current_page,
    audit_logs,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
