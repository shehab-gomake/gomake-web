# CategoryCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The name of the category | [optional] [default to undefined]
**description** | **string** | A description for the category | [optional] [default to undefined]
**position** | **number** | Category position in the portal list to sort | [optional] [default to undefined]
**slug** | **string** | The category slug used in the URL | [optional] [default to undefined]
**locale** | **string** | The locale of the category | [optional] [default to undefined]
**icon** | **string** | The icon of the category as a string (emoji) | [optional] [default to undefined]
**parent_category_id** | **number** | To define parent category, e.g product documentation has multiple level features in sales category or in engineering category. | [optional] [default to undefined]
**associated_category_id** | **number** | To associate similar categories to each other, e.g same category of product documentation in different languages | [optional] [default to undefined]

## Example

```typescript
import { CategoryCreateUpdatePayload } from './api';

const instance: CategoryCreateUpdatePayload = {
    name,
    description,
    position,
    slug,
    locale,
    icon,
    parent_category_id,
    associated_category_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
