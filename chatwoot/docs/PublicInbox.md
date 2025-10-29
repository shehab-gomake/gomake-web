# PublicInbox


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identifier** | **string** | Inbox identifier | [optional] [default to undefined]
**name** | **string** | Name of the inbox | [optional] [default to undefined]
**timezone** | **string** | The timezone defined on the inbox | [optional] [default to undefined]
**working_hours** | [**Array&lt;PublicInboxWorkingHoursInner&gt;**](PublicInboxWorkingHoursInner.md) | The working hours defined on the inbox | [optional] [default to undefined]
**working_hours_enabled** | **boolean** | Whether of not the working hours are enabled on the inbox | [optional] [default to undefined]
**csat_survey_enabled** | **boolean** | Whether of not the Customer Satisfaction survey is enabled on the inbox | [optional] [default to undefined]
**greeting_enabled** | **boolean** | Whether of not the Greeting Message is enabled on the inbox | [optional] [default to undefined]
**identity_validation_enabled** | **boolean** | Whether of not the User Identity Validation is enforced on the inbox | [optional] [default to undefined]

## Example

```typescript
import { PublicInbox } from './api';

const instance: PublicInbox = {
    identifier,
    name,
    timezone,
    working_hours,
    working_hours_enabled,
    csat_survey_enabled,
    greeting_enabled,
    identity_validation_enabled,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
