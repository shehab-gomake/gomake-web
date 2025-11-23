# InboxWorkingHoursInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**day_of_week** | **number** | Day of the week (0-6, where 0 is Sunday) | [optional] [default to undefined]
**closed_all_day** | **boolean** | Whether the inbox is closed for the entire day | [optional] [default to undefined]
**open_hour** | **number** | Hour when inbox opens (0-23) | [optional] [default to undefined]
**open_minutes** | **number** | Minutes of the hour when inbox opens (0-59) | [optional] [default to undefined]
**close_hour** | **number** | Hour when inbox closes (0-23) | [optional] [default to undefined]
**close_minutes** | **number** | Minutes of the hour when inbox closes (0-59) | [optional] [default to undefined]
**open_all_day** | **boolean** | Whether the inbox is open for the entire day | [optional] [default to undefined]

## Example

```typescript
import { InboxWorkingHoursInner } from './api';

const instance: InboxWorkingHoursInner = {
    day_of_week,
    closed_all_day,
    open_hour,
    open_minutes,
    close_hour,
    close_minutes,
    open_all_day,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
