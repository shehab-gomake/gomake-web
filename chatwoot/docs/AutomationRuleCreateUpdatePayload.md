# AutomationRuleCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Rule name | [optional] [default to undefined]
**description** | **string** | The description about the automation and actions | [optional] [default to undefined]
**event_name** | **string** | The event when you want to execute the automation actions | [optional] [default to undefined]
**active** | **boolean** | Enable/disable automation rule | [optional] [default to undefined]
**actions** | **Array&lt;object&gt;** | Array of actions which you want to perform when condition matches, e.g add label support if message contains content help. | [optional] [default to undefined]
**conditions** | **Array&lt;object&gt;** | Array of conditions on which conversation filter would work, e.g message content contains text help. | [optional] [default to undefined]

## Example

```typescript
import { AutomationRuleCreateUpdatePayload } from './api';

const instance: AutomationRuleCreateUpdatePayload = {
    name,
    description,
    event_name,
    active,
    actions,
    conditions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
