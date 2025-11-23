# CustomAttribute


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | Identifier | [optional] [default to undefined]
**attribute_display_name** | **string** | Attribute display name | [optional] [default to undefined]
**attribute_display_type** | **string** | Attribute display type (text, number, currency, percent, link, date, list, checkbox) | [optional] [default to undefined]
**attribute_description** | **string** | Attribute description | [optional] [default to undefined]
**attribute_key** | **string** | Attribute unique key value | [optional] [default to undefined]
**regex_pattern** | **string** | Regex pattern | [optional] [default to undefined]
**regex_cue** | **string** | Regex cue | [optional] [default to undefined]
**attribute_values** | **string** | Attribute values | [optional] [default to undefined]
**attribute_model** | **string** | Attribute type(conversation_attribute/contact_attribute) | [optional] [default to undefined]
**default_value** | **string** | Attribute default value | [optional] [default to undefined]
**created_at** | **string** | The date and time when the custom attribute was created | [optional] [default to undefined]
**updated_at** | **string** | The date and time when the custom attribute was updated | [optional] [default to undefined]

## Example

```typescript
import { CustomAttribute } from './api';

const instance: CustomAttribute = {
    id,
    attribute_display_name,
    attribute_display_type,
    attribute_description,
    attribute_key,
    regex_pattern,
    regex_cue,
    attribute_values,
    attribute_model,
    default_value,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
