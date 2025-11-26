# Chatwoot Inbox Settings - Implementation Comparison

This document compares our current implementation against the comprehensive specification provided by the Chatwoot team.

**Scope**: Email and WhatsApp channels only (Web Widget features excluded)

## 📊 Summary

| Category | Implemented | Missing | Total |
|----------|------------|---------|-------|
| **Inbox Identity & Branding** | 1/2 | 1 | 2 |
| **Channel-Specific Configurations** | 0/1 | 1 | 1 |
| **Conversation Experience** | 2/3 | 1 | 3 |
| **Sender Name Configuration** | 1/2 | 1 | 2 |
| **TOTAL** | **4/8** | **4** | **8** |

---

## ✅ What We Have

### 1. Inbox Identity & Branding

#### ✅ Inbox Name
- **Status**: ✅ Implemented
- **Location**: `InboxSettingsTab.tsx` lines 73-85
- **Implementation**: TextField with proper validation
- **API Support**: ✅ Available in `updateInbox`

#### ❌ Inbox Avatar
- **Status**: ❌ Missing UI (API exists)
- **API Support**: ✅ `uploadAvatar()` and `deleteAvatar()` methods exist in `chatwoot-inboxes.service.ts`
- **Component Available**: ✅ `AvatarUploader` component exists in `components/settings/AvatarUploader.tsx`
- **Action Needed**: Integrate AvatarUploader into InboxSettingsTab

---

### 2. Channel-Specific Configurations

#### ❌ WhatsApp API Provider Name (WhatsApp)
- **Status**: ❌ Missing
- **Field**: `provider` (read-only display)
- **Condition**: Only for `Channel::WhatsApp`
- **Action Needed**: Add read-only display field showing provider name (e.g., "WhatsApp Cloud", "360 Dialog", "Twilio")

---

### 3. Conversation Experience Settings

#### ✅ Greeting Message (Enable/Disable)
- **Status**: ✅ Implemented
- **Location**: `InboxSettingsTab.tsx` lines 87-116
- **Implementation**: Switch toggle with conditional editor
- **API Support**: ✅ `greeting_enabled` field

#### ✅ Greeting Message Content
- **Status**: ✅ Implemented
- **Location**: `InboxSettingsTab.tsx` lines 106-115
- **Implementation**: RichTextEditor with channel-specific max length
- **API Support**: ✅ `greeting_message` field

#### ❌ Help Center Portal (Email & WhatsApp)
- **Status**: ❌ Missing
- **Field**: `portal_id` (number)
- **Condition**: All channels except Voice (applies to Email & WhatsApp)
- **Action Needed**: Add portal selection dropdown (need to fetch portals list API)

#### ❌ Lock to Single Conversation (WhatsApp)
- **Status**: ❌ Missing
- **Field**: `lock_to_single_conversation` (boolean)
- **Condition**: WhatsApp channels (also applies to SMS, Facebook, API, Telegram)
- **API Support**: ✅ Available in `InboxUpdatePayload`
- **Action Needed**: Add conditional switch for WhatsApp inboxes

---

### 4. Sender Name Configuration

#### ✅ Sender Name Type (Email)
- **Status**: ✅ Implemented
- **Location**: `InboxSettingsTab.tsx` lines 139-294
- **Implementation**: Card-based selector (Friendly/Professional)
- **API Support**: ✅ `sender_name_type` field

#### ❌ Business Name
- **Status**: ❌ Missing
- **Field**: `business_name` (string)
- **Condition**: Only visible when `sender_name_type === "professional"`
- **Action Needed**: Add conditional input field

---

## 🔧 Implementation Notes

### API Payload Structure

For Email and WhatsApp, the payload structure is straightforward:

```typescript
{
  name: string,
  greeting_enabled: boolean,
  greeting_message: string,
  lock_to_single_conversation?: boolean, // WhatsApp only
  portal_id?: number, // Help Center portal
  sender_name_type?: "friendly" | "professional", // Email only
  business_name?: string, // Email only, when sender_name_type = "professional"
  // Avatar is uploaded via separate endpoint
}
```

### Channel Type Detection

We already have:
- `isEmail = inbox.channel_type?.includes("Email")`

Need to add:
- `isWhatsApp = inbox.channel_type?.includes("WhatsApp")`

---

## 📋 Priority Implementation Order

### High Priority (Core Functionality)
1. ✅ **Inbox Avatar** - UI integration (API exists, component ready)
2. ✅ **Business Name** - Required for professional sender name (Email only)
3. ✅ **Lock to Single Conversation** - Important for WhatsApp inboxes

### Medium Priority (Feature Completeness)
4. ✅ **Help Center Portal** - Requires portal list API integration
5. ✅ **WhatsApp Provider Name** - Read-only informational field

---

## 🎯 Next Steps

1. **Integrate Avatar Uploader**: Add `AvatarUploader` component to `InboxSettingsTab.tsx`
2. **Add Business Name Field**: Conditional TextField for Email when sender_name_type = "professional"
3. **Add Lock to Single Conversation**: Switch toggle for WhatsApp inboxes
4. **Add WhatsApp Provider Display**: Read-only field showing provider name
5. **Add Portal API Integration**: Fetch portals list for Help Center dropdown (if needed)
6. **Update Channel Detection**: Add `isWhatsApp` helper
7. **Test Channel-Specific Logic**: Ensure Email vs WhatsApp conditional visibility works correctly

