# Chatwoot Inbox Settings - Quick Reference

**Scope**: Email and WhatsApp channels only (Web Widget features excluded)

## ✅ Currently Implemented (4/8)

| Feature | Status | Notes |
|---------|--------|-------|
| Inbox Name | ✅ | Fully working |
| Greeting Enable/Disable | ✅ | Fully working |
| Greeting Message Content | ✅ | Rich text editor with channel limits |
| Sender Name Type | ✅ | Email only (Friendly/Professional cards) |

---

## ❌ Missing Features (4/8)

### Inbox Identity & Branding
- ❌ **Inbox Avatar** - API exists, UI missing (component ready to integrate)

### Channel-Specific Configurations
- ❌ **WhatsApp API Provider Name** - WhatsApp only (read-only display: "WhatsApp Cloud", "360 Dialog", "Twilio")

### Conversation Experience
- ❌ **Help Center Portal** - Email & WhatsApp (needs portal list API)
- ❌ **Lock to Single Conversation** - WhatsApp only (prevents multiple active conversations per contact)

### Sender Name Configuration
- ❌ **Business Name** - Email only (required when sender_name_type = "professional")

---

## 🔑 Key Implementation Details

### Channel Type Detection
```typescript
const isEmail = inbox.channel_type?.includes("Email");
const isWhatsApp = inbox.channel_type?.includes("WhatsApp");
```

### API Payload Structure
```typescript
// For Email inboxes
{
  name: string,
  greeting_enabled: boolean,
  greeting_message: string,
  sender_name_type: "friendly" | "professional",
  business_name?: string, // Required if sender_name_type = "professional"
  portal_id?: number
}

// For WhatsApp inboxes
{
  name: string,
  greeting_enabled: boolean,
  greeting_message: string,
  lock_to_single_conversation: boolean,
  portal_id?: number
  // provider is read-only, comes from inbox object
}
```

### Avatar Upload
- **API Methods**: `uploadAvatar()` and `deleteAvatar()` exist
- **Component**: `AvatarUploader` component ready at `components/settings/AvatarUploader.tsx`
- **Endpoint**: Separate endpoint `/api/accounts/inboxes/{inboxId}/avatar`

---

## 📦 Available Components & APIs

### ✅ Ready to Use
- `AvatarUploader` component exists at `components/settings/AvatarUploader.tsx`
- `uploadAvatar()` and `deleteAvatar()` API methods exist
- `RichTextEditor` component available
- `updateInbox()` API supports all fields

### ⚠️ Needs Integration
- Portal list API (for Help Center dropdown) - may not be needed if not using Help Center

---

## 🎯 Quick Wins (Easy to Implement)

1. **Inbox Avatar** ⭐ - Just integrate existing `AvatarUploader` component (5 min)
2. **Business Name** ⭐ - Simple TextField, conditional on sender_name_type = "professional" (5 min)
3. **Lock to Single Conversation** ⭐ - Simple Switch, add `isWhatsApp` condition (5 min)
4. **WhatsApp Provider Name** - Read-only TextField with `disabled` prop (2 min)

**Total estimated time: ~20 minutes for all 4 features**

---

## 📋 Implementation Checklist

### Inbox Avatar
- [ ] Import `AvatarUploader` component
- [ ] Add avatar upload section to `InboxSettingsTab`
- [ ] Handle `onUpload` callback with `chatwootService.inboxes.uploadAvatar()`
- [ ] Handle `onDelete` callback with `chatwootService.inboxes.deleteAvatar()`
- [ ] Pass `currentAvatar={inbox.avatar_url}`

### Business Name
- [ ] Add `business_name` to formData state
- [ ] Add conditional TextField (only show when `sender_name_type === "professional"`)
- [ ] Include in save payload

### Lock to Single Conversation
- [ ] Add `lock_to_single_conversation` to formData state
- [ ] Add `isWhatsApp` helper
- [ ] Add conditional Switch (only show for WhatsApp)
- [ ] Include in save payload

### WhatsApp Provider Name
- [ ] Add `isWhatsApp` helper
- [ ] Add read-only TextField showing `inbox.provider`
- [ ] Style as disabled/informational

---

## 📚 Related Files

- **Current Implementation**: `src/widgets/frontdesk/providers/chatwoot/views/settings/tabs/InboxSettingsTab.tsx`
- **API Service**: `src/services/frontdesk/api/chatwoot/services/chatwoot-inboxes.service.ts`
- **Types**: `src/services/frontdesk/api/chatwoot/types/inboxes.types.ts`
- **Avatar Component**: `src/widgets/frontdesk/providers/chatwoot/components/settings/AvatarUploader.tsx`

---

## 🎨 UI Layout Suggestions

```
Inbox Settings Tab
├── Inbox Identity & Branding
│   ├── Inbox Avatar (NEW)
│   └── Inbox Name ✅
├── Channel-Specific (WhatsApp only)
│   └── Provider Name (NEW - read-only)
├── Conversation Experience
│   ├── Greeting Message ✅
│   ├── Help Center Portal (NEW - optional)
│   └── Lock to Single Conversation (NEW - WhatsApp only)
└── Sender Name (Email only)
    ├── Sender Name Type ✅
    └── Business Name (NEW - conditional)
```
