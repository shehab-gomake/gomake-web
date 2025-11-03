# AgentBotCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The name of the agent bot | [optional] [default to undefined]
**description** | **string** | The description of the agent bot | [optional] [default to undefined]
**outgoing_url** | **string** | The webhook URL for the bot | [optional] [default to undefined]
**avatar** | **File** | Send the form data with the avatar image binary or use the avatar_url | [optional] [default to undefined]
**avatar_url** | **string** | The url to a jpeg, png file for the agent bot avatar | [optional] [default to undefined]
**bot_type** | **number** | The type of the bot (0 for webhook) | [optional] [default to undefined]
**bot_config** | **object** | The configuration for the bot | [optional] [default to undefined]

## Example

```typescript
import { AgentBotCreateUpdatePayload } from './api';

const instance: AgentBotCreateUpdatePayload = {
    name,
    description,
    outgoing_url,
    avatar,
    avatar_url,
    bot_type,
    bot_config,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
