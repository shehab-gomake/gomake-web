# Category


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**description** | **string** | The text content. | [optional] [default to undefined]
**locale** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**slug** | **string** |  | [optional] [default to undefined]
**position** | **number** |  | [optional] [default to undefined]
**portal_id** | **number** |  | [optional] [default to undefined]
**account_id** | **number** |  | [optional] [default to undefined]
**associated_category_id** | **number** | To associate similar categories to each other, e.g same category of product documentation in different languages | [optional] [default to undefined]
**parent_category_id** | **number** | To define parent category, e.g product documentation has multiple level features in sales category or in engineering category. | [optional] [default to undefined]

## Example

```typescript
import { Category } from './api';

const instance: Category = {
    id,
    description,
    locale,
    name,
    slug,
    position,
    portal_id,
    account_id,
    associated_category_id,
    parent_category_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
