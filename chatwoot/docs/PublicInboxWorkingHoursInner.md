# PublicInboxWorkingHoursInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**day_of_week** | **number** | Day of the week as a number. Sunday -&gt; 0, Saturday -&gt; 6 | [optional] [default to undefined]
**open_all_day** | **boolean** | Whether or not the business is open the whole day | [optional] [default to undefined]
**closed_all_day** | **boolean** | Whether or not the business is closed the whole day | [optional] [default to undefined]
**open_hour** | **number** | Opening hour. Can be null if closed all day | [optional] [default to undefined]
**open_minutes** | **number** | Opening minute. Can be null if closed all day | [optional] [default to undefined]
**close_hour** | **number** | Closing hour. Can be null if closed all day | [optional] [default to undefined]
**close_minutes** | **number** | Closing minute. Can be null if closed all day | [optional] [default to undefined]

## Example

```typescript
import { PublicInboxWorkingHoursInner } from './api';

const instance: PublicInboxWorkingHoursInner = {
    day_of_week,
    open_all_day,
    closed_all_day,
    open_hour,
    open_minutes,
    close_hour,
    close_minutes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
