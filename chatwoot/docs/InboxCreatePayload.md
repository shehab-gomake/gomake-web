# InboxCreatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The name of the inbox | [optional] [default to undefined]
**avatar** | **File** | Image file for avatar | [optional] [default to undefined]
**greeting_enabled** | **boolean** | Enable greeting message | [optional] [default to undefined]
**greeting_message** | **string** | Greeting message to be displayed on the widget | [optional] [default to undefined]
**enable_email_collect** | **boolean** | Enable email collection | [optional] [default to undefined]
**csat_survey_enabled** | **boolean** | Enable CSAT survey | [optional] [default to undefined]
**enable_auto_assignment** | **boolean** | Enable Auto Assignment | [optional] [default to undefined]
**working_hours_enabled** | **boolean** | Enable working hours | [optional] [default to undefined]
**out_of_office_message** | **string** | Out of office message to be displayed on the widget | [optional] [default to undefined]
**timezone** | **string** | Timezone of the inbox | [optional] [default to undefined]
**allow_messages_after_resolved** | **boolean** | Allow messages after conversation is resolved | [optional] [default to undefined]
**lock_to_single_conversation** | **boolean** | Lock to single conversation | [optional] [default to undefined]
**portal_id** | **number** | Id of the help center portal to attach to the inbox | [optional] [default to undefined]
**sender_name_type** | **string** | Sender name type for the inbox | [optional] [default to undefined]
**business_name** | **string** | Business name for the inbox | [optional] [default to undefined]
**channel** | [**InboxCreatePayloadChannel**](InboxCreatePayloadChannel.md) |  | [optional] [default to undefined]

## Example

```typescript
import { InboxCreatePayload } from './api';

const instance: InboxCreatePayload = {
    name,
    avatar,
    greeting_enabled,
    greeting_message,
    enable_email_collect,
    csat_survey_enabled,
    enable_auto_assignment,
    working_hours_enabled,
    out_of_office_message,
    timezone,
    allow_messages_after_resolved,
    lock_to_single_conversation,
    portal_id,
    sender_name_type,
    business_name,
    channel,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
