# ContactFilterRequestPayloadInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**attribute_key** | **string** | filter attribute name | [optional] [default to undefined]
**filter_operator** | **string** | filter operator name | [optional] [default to undefined]
**values** | **Array&lt;string&gt;** | array of the attribute values to filter | [optional] [default to undefined]
**query_operator** | **string** | query operator name | [optional] [default to undefined]

## Example

```typescript
import { ContactFilterRequestPayloadInner } from './api';

const instance: ContactFilterRequestPayloadInner = {
    attribute_key,
    filter_operator,
    values,
    query_operator,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
