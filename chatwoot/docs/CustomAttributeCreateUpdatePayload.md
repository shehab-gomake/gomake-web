# CustomAttributeCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**attribute_display_name** | **string** | Attribute display name | [optional] [default to undefined]
**attribute_display_type** | **number** | Attribute display type (text- 0, number- 1, currency- 2, percent- 3, link- 4, date- 5, list- 6, checkbox- 7) | [optional] [default to undefined]
**attribute_description** | **string** | Attribute description | [optional] [default to undefined]
**attribute_key** | **string** | Attribute unique key value | [optional] [default to undefined]
**attribute_values** | **Array&lt;string&gt;** | Attribute values | [optional] [default to undefined]
**attribute_model** | **number** | Attribute type(conversation_attribute- 0, contact_attribute- 1) | [optional] [default to undefined]
**regex_pattern** | **string** | Regex pattern (Only applicable for type- text). The regex pattern is used to validate the attribute value(s). | [optional] [default to undefined]
**regex_cue** | **string** | Regex cue message (Only applicable for type- text). The cue message is shown when the regex pattern is not matched. | [optional] [default to undefined]

## Example

```typescript
import { CustomAttributeCreateUpdatePayload } from './api';

const instance: CustomAttributeCreateUpdatePayload = {
    attribute_display_name,
    attribute_display_type,
    attribute_description,
    attribute_key,
    attribute_values,
    attribute_model,
    regex_pattern,
    regex_cue,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
