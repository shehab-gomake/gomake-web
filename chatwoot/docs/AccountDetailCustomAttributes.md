# AccountDetailCustomAttributes

Custom attributes of the account

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**plan_name** | **string** | Subscription plan name | [optional] [default to undefined]
**subscribed_quantity** | **number** | Subscribed quantity | [optional] [default to undefined]
**subscription_status** | **string** | Subscription status | [optional] [default to undefined]
**subscription_ends_on** | **string** | Subscription end date | [optional] [default to undefined]
**industry** | **string** | Industry type | [optional] [default to undefined]
**company_size** | **string** | Company size | [optional] [default to undefined]
**timezone** | **string** | Account timezone | [optional] [default to undefined]
**logo** | **string** | Account logo URL | [optional] [default to undefined]
**onboarding_step** | **string** | Current onboarding step | [optional] [default to undefined]
**marked_for_deletion_at** | **string** | When account was marked for deletion | [optional] [default to undefined]
**marked_for_deletion_reason** | **string** | Reason for account deletion | [optional] [default to undefined]

## Example

```typescript
import { AccountDetailCustomAttributes } from './api';

const instance: AccountDetailCustomAttributes = {
    plan_name,
    subscribed_quantity,
    subscription_status,
    subscription_ends_on,
    industry,
    company_size,
    timezone,
    logo,
    onboarding_step,
    marked_for_deletion_at,
    marked_for_deletion_reason,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
