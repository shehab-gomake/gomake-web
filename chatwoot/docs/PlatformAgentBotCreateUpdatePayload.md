# PlatformAgentBotCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The name of the agent bot | [optional] [default to undefined]
**description** | **string** | The description of the agent bot | [optional] [default to undefined]
**outgoing_url** | **string** | The webhook URL for the bot | [optional] [default to undefined]
**account_id** | **number** | The account ID to associate the agent bot with | [optional] [default to undefined]
**avatar** | **File** | Send the form data with the avatar image binary or use the avatar_url | [optional] [default to undefined]
**avatar_url** | **string** | The url to a jpeg, png file for the agent bot avatar | [optional] [default to undefined]

## Example

```typescript
import { PlatformAgentBotCreateUpdatePayload } from './api';

const instance: PlatformAgentBotCreateUpdatePayload = {
    name,
    description,
    outgoing_url,
    account_id,
    avatar,
    avatar_url,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
