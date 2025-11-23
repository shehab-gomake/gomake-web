# PortalItem


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | The ID of the portal | [optional] [default to undefined]
**archived** | **boolean** | Whether the portal is archived | [optional] [default to undefined]
**color** | **string** | The color code for the portal | [optional] [default to undefined]
**config** | [**PortalConfig**](PortalConfig.md) |  | [optional] [default to undefined]
**custom_domain** | **string** | Custom domain for the portal | [optional] [default to undefined]
**header_text** | **string** | The header text for the portal | [optional] [default to undefined]
**homepage_link** | **string** | Homepage link for the portal | [optional] [default to undefined]
**name** | **string** | Name of the portal | [optional] [default to undefined]
**slug** | **string** | URL slug for the portal | [optional] [default to undefined]
**page_title** | **string** | Page title for the portal | [optional] [default to undefined]
**account_id** | **number** | ID of the account the portal belongs to | [optional] [default to undefined]
**inbox** | [**Inbox**](Inbox.md) |  | [optional] [default to undefined]
**logo** | [**PortalLogo**](PortalLogo.md) |  | [optional] [default to undefined]
**meta** | [**PortalMeta**](PortalMeta.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PortalItem } from './api';

const instance: PortalItem = {
    id,
    archived,
    color,
    config,
    custom_domain,
    header_text,
    homepage_link,
    name,
    slug,
    page_title,
    account_id,
    inbox,
    logo,
    meta,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
