# AgentBot


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | ID of the agent bot | [optional] [default to undefined]
**name** | **string** | The name of the agent bot | [optional] [default to undefined]
**description** | **string** | The description about the agent bot | [optional] [default to undefined]
**thumbnail** | **string** | The thumbnail of the agent bot | [optional] [default to undefined]
**outgoing_url** | **string** | The webhook URL for the bot | [optional] [default to undefined]
**bot_type** | **string** | The type of the bot | [optional] [default to undefined]
**bot_config** | **object** | The configuration of the bot | [optional] [default to undefined]
**account_id** | **number** | Account ID if it\&#39;s an account specific bot | [optional] [default to undefined]
**access_token** | **string** | The access token for the bot | [optional] [default to undefined]
**system_bot** | **boolean** | Whether the bot is a system bot | [optional] [default to undefined]

## Example

```typescript
import { AgentBot } from './api';

const instance: AgentBot = {
    id,
    name,
    description,
    thumbnail,
    outgoing_url,
    bot_type,
    bot_config,
    account_id,
    access_token,
    system_bot,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
