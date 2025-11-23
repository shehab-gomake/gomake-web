# Inbox


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | ID of the inbox | [optional] [default to undefined]
**name** | **string** | The name of the inbox | [optional] [default to undefined]
**website_url** | **string** | Website URL | [optional] [default to undefined]
**channel_type** | **string** | The type of the inbox | [optional] [default to undefined]
**avatar_url** | **string** | The avatar image of the inbox | [optional] [default to undefined]
**widget_color** | **string** | Widget Color used for customization of the widget | [optional] [default to undefined]
**website_token** | **string** | Website Token | [optional] [default to undefined]
**enable_auto_assignment** | **boolean** | The flag which shows whether Auto Assignment is enabled or not | [optional] [default to undefined]
**web_widget_script** | **string** | Script used to load the website widget | [optional] [default to undefined]
**welcome_title** | **string** | Welcome title to be displayed on the widget | [optional] [default to undefined]
**welcome_tagline** | **string** | Welcome tagline to be displayed on the widget | [optional] [default to undefined]
**greeting_enabled** | **boolean** | The flag which shows whether greeting is enabled | [optional] [default to undefined]
**greeting_message** | **string** | A greeting message when the user starts the conversation | [optional] [default to undefined]
**channel_id** | **number** | ID of the channel this inbox belongs to | [optional] [default to undefined]
**working_hours_enabled** | **boolean** | The flag which shows whether working hours feature is enabled | [optional] [default to undefined]
**enable_email_collect** | **boolean** | The flag to enable collecting email from contacts | [optional] [default to undefined]
**csat_survey_enabled** | **boolean** | The flag to enable CSAT survey | [optional] [default to undefined]
**auto_assignment_config** | **object** | Configuration settings for auto assignment | [optional] [default to undefined]
**out_of_office_message** | **string** | Message to show when agents are out of office | [optional] [default to undefined]
**working_hours** | [**Array&lt;InboxWorkingHoursInner&gt;**](InboxWorkingHoursInner.md) | Configuration for working hours of the inbox | [optional] [default to undefined]
**timezone** | **string** | Timezone configuration for the inbox | [optional] [default to undefined]
**callback_webhook_url** | **string** | Webhook URL for callbacks | [optional] [default to undefined]
**allow_messages_after_resolved** | **boolean** | Whether to allow messages after a conversation is resolved | [optional] [default to undefined]
**lock_to_single_conversation** | **boolean** | Whether to lock a contact to a single conversation | [optional] [default to undefined]
**sender_name_type** | **string** | Type of sender name to display (e.g., friendly) | [optional] [default to undefined]
**business_name** | **string** | Business name associated with the inbox | [optional] [default to undefined]
**hmac_mandatory** | **boolean** | Whether HMAC verification is mandatory | [optional] [default to undefined]
**selected_feature_flags** | **object** | Selected feature flags for the inbox | [optional] [default to undefined]
**reply_time** | **string** | Expected reply time | [optional] [default to undefined]
**messaging_service_sid** | **string** | Messaging service SID for SMS providers | [optional] [default to undefined]
**phone_number** | **string** | Phone number associated with the inbox | [optional] [default to undefined]
**medium** | **string** | Medium of communication (e.g., sms, email) | [optional] [default to undefined]
**provider** | **string** | Provider of the channel | [optional] [default to undefined]

## Example

```typescript
import { Inbox } from './api';

const instance: Inbox = {
    id,
    name,
    website_url,
    channel_type,
    avatar_url,
    widget_color,
    website_token,
    enable_auto_assignment,
    web_widget_script,
    welcome_title,
    welcome_tagline,
    greeting_enabled,
    greeting_message,
    channel_id,
    working_hours_enabled,
    enable_email_collect,
    csat_survey_enabled,
    auto_assignment_config,
    out_of_office_message,
    working_hours,
    timezone,
    callback_webhook_url,
    allow_messages_after_resolved,
    lock_to_single_conversation,
    sender_name_type,
    business_name,
    hmac_mandatory,
    selected_feature_flags,
    reply_time,
    messaging_service_sid,
    phone_number,
    medium,
    provider,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
