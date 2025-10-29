# ArticleCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | The title of the article | [optional] [default to undefined]
**slug** | **string** | The slug of the article | [optional] [default to undefined]
**position** | **number** | article position in category | [optional] [default to undefined]
**content** | **string** | The text content. | [optional] [default to undefined]
**description** | **string** | The description of the article | [optional] [default to undefined]
**category_id** | **number** | The category id of the article | [optional] [default to undefined]
**author_id** | **number** | The author agent id of the article | [optional] [default to undefined]
**associated_article_id** | **number** | To associate similar articles to each other, e.g to provide the link for the reference. | [optional] [default to undefined]
**status** | **number** | The status of the article. 0 for draft, 1 for published, 2 for archived | [optional] [default to undefined]
**locale** | **string** | The locale of the article | [optional] [default to undefined]
**meta** | **object** | Use for search | [optional] [default to undefined]

## Example

```typescript
import { ArticleCreateUpdatePayload } from './api';

const instance: ArticleCreateUpdatePayload = {
    title,
    slug,
    position,
    content,
    description,
    category_id,
    author_id,
    associated_article_id,
    status,
    locale,
    meta,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
