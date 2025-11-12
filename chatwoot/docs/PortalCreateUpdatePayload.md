# PortalCreateUpdatePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**color** | **string** | Header color for help-center in hex format | [optional] [default to undefined]
**custom_domain** | **string** | Custom domain to display help center. | [optional] [default to undefined]
**header_text** | **string** | Help center header | [optional] [default to undefined]
**homepage_link** | **string** | link to main dashboard | [optional] [default to undefined]
**name** | **string** | Name for the portal | [optional] [default to undefined]
**page_title** | **string** | Page title for the portal | [optional] [default to undefined]
**slug** | **string** | Slug for the portal to display in link | [optional] [default to undefined]
**archived** | **boolean** | Status to check if portal is live | [optional] [default to undefined]
**config** | **object** | Configuration about supporting locales | [optional] [default to undefined]

## Example

```typescript
import { PortalCreateUpdatePayload } from './api';

const instance: PortalCreateUpdatePayload = {
    color,
    custom_domain,
    header_text,
    homepage_link,
    name,
    page_title,
    slug,
    archived,
    config,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
