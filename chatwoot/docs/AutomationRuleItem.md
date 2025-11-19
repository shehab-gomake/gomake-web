# AutomationRuleItem


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | The ID of the automation rule | [optional] [default to undefined]
**account_id** | **number** | Account Id | [optional] [default to undefined]
**name** | **string** | The name of the rule | [optional] [default to undefined]
**description** | **string** | Description to give more context about the rule | [optional] [default to undefined]
**event_name** | **string** | Automation Rule event, on which we call the actions(conversation_created, conversation_updated, message_created) | [optional] [default to undefined]
**conditions** | [**Array&lt;AutomationRuleItemConditionsInner&gt;**](AutomationRuleItemConditionsInner.md) | Array of conditions on which conversation/message filter would work | [optional] [default to undefined]
**actions** | [**Array&lt;AutomationRuleItemActionsInner&gt;**](AutomationRuleItemActionsInner.md) | Array of actions which we perform when condition matches | [optional] [default to undefined]
**created_on** | **number** | The timestamp when the rule was created | [optional] [default to undefined]
**active** | **boolean** | Enable/disable automation rule | [optional] [default to undefined]

## Example

```typescript
import { AutomationRuleItem } from './api';

const instance: AutomationRuleItem = {
    id,
    account_id,
    name,
    description,
    event_name,
    conditions,
    actions,
    created_on,
    active,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
