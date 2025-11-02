# Reply Box Layout Refactoring Guide

This comprehensive guide explains how Chatwoot determines response box layouts for different channel types (WhatsApp, Email, etc.) and provides recommendations for refactoring this logic in a new frontend.

## Table of Contents
1. [Backend Data Structure](#backend-data-structure)
2. [Channel Type Identification](#channel-type-identification)
3. [Feature Matrix by Channel](#feature-matrix-by-channel)
4. [Conditional Logic Breakdown](#conditional-logic-breakdown)
5. [Message Length Limits](#message-length-limits)
6. [Refactoring Recommendations](#refactoring-recommendations)

---

## Backend Data Structure

### Inbox Object (from API)

The inbox object is returned from the API with the following key structure:

```javascript
{
  id: number,
  name: string,
  channel_type: string,  // Primary identifier: 'Channel::Email', 'Channel::Whatsapp', etc.
  channel_id: number,
  provider: string | null,  // For WhatsApp: 'whatsapp_cloud', 'default', etc.
  medium: string | null,    // For Twilio: 'whatsapp', 'sms'
  email: string | null,     // For email channels
  forward_to_email: string | null,  // For email channels
  // ... other inbox settings
}
```

### Channel Type Constants

```javascript
const INBOX_TYPES = {
  WEB: 'Channel::WebWidget',
  FB: 'Channel::FacebookPage',
  TWITTER: 'Channel::TwitterProfile',
  TWILIO: 'Channel::TwilioSms',
  WHATSAPP: 'Channel::Whatsapp',
  API: 'Channel::Api',
  EMAIL: 'Channel::Email',
  TELEGRAM: 'Channel::Telegram',
  LINE: 'Channel::Line',
  SMS: 'Channel::Sms',
  INSTAGRAM: 'Channel::Instagram',
  VOICE: 'Channel::Voice',
};
```

### Conversation Object (from API)

```javascript
{
  id: number,
  inbox_id: number,
  can_reply: boolean,  // Critical: determines if reply is allowed
  meta: {
    sender: {
      id: number,
      email: string,
      // ...
    }
  },
  // ...
}
```

---

## Channel Type Identification

### Primary Identification

Channel type is identified via `inbox.channel_type`:

```javascript
function getChannelType(inbox) {
  return inbox.channel_type;
}

function isEmailChannel(inbox) {
  return inbox.channel_type === 'Channel::Email';
}

function isWhatsAppChannel(inbox) {
  return inbox.channel_type === 'Channel::Whatsapp' || 
         (inbox.channel_type === 'Channel::TwilioSms' && inbox.medium === 'whatsapp');
}
```

### Sub-Type Detection (WhatsApp Variants)

WhatsApp has multiple providers/sub-types:

```javascript
function getWhatsAppProvider(inbox) {
  if (inbox.channel_type !== 'Channel::Whatsapp') return null;
  return inbox.provider || 'default';  // 'whatsapp_cloud' or 'default'
}

function isWhatsAppCloudChannel(inbox) {
  return inbox.channel_type === 'Channel::Whatsapp' && 
         inbox.provider === 'whatsapp_cloud';
}

function is360DialogWhatsAppChannel(inbox) {
  return inbox.channel_type === 'Channel::Whatsapp' && 
         (inbox.provider === 'default' || !inbox.provider);
}

function isTwilioWhatsAppChannel(inbox) {
  return inbox.channel_type === 'Channel::TwilioSms' && 
         inbox.medium === 'whatsapp';
}
```

---

## Feature Matrix by Channel

### Editor Type Selection

| Channel Type | Rich Editor | Plain Textarea | Conditional |
|--------------|-------------|----------------|-------------|
| **Email** | ✅ Default | ❌ | Always rich editor |
| **Web Widget** | ✅ Default | ❌ | Always rich editor |
| **WhatsApp** | ❌ | ✅ Default | Always plain textarea |
| **API** | ⚠️ Configurable | ⚠️ Configurable | User setting: `display_rich_content_editor` |
| **Facebook** | ❌ | ✅ Default | Always plain textarea |
| **Instagram** | ❌ | ✅ Default | Always plain textarea |
| **Telegram** | ❌ | ✅ Default | Always plain textarea |
| **SMS** | ❌ | ✅ Default | Always plain textarea |
| **Others** | ❌ | ✅ Default | Always plain textarea |

**Code Logic:**
```javascript
function shouldShowRichEditor(inbox, isPrivateNote, uiSettings) {
  // Private notes always use rich editor
  if (isPrivateNote) return true;
  
  // Email and Web Widget always use rich editor
  if (isEmailChannel(inbox) || isWebWidgetChannel(inbox)) {
    return true;
  }
  
  // API inbox is configurable
  if (isAPIChannel(inbox)) {
    return uiSettings?.display_rich_content_editor === true;
  }
  
  return false;
}
```

### Email-Specific Features

| Feature | Email | Other Channels |
|---------|-------|----------------|
| **Email Header (To/CC/BCC)** | ✅ Always shown | ❌ Never |
| **Quoted Email Reply** | ✅ If enabled | ❌ Never |
| **Signature** | ✅ Optional | ⚠️ Some channels |
| **Rich Editor** | ✅ Always | ⚠️ See above |

### WhatsApp-Specific Features

| Feature | WhatsApp Cloud | Twilio WhatsApp | Other |
|---------|----------------|-----------------|-------|
| **Templates Modal** | ✅ | ❌ | ❌ |
| **Content Templates** | ❌ | ✅ | ❌ |
| **Plain Text Editor** | ✅ | ✅ | ⚠️ Varies |
| **Multiple Message Split** | ✅ | ✅ | ❌ |
| **Audio Format** | MP3 | MP3 | WAV |

### File Upload Support

```javascript
function supportsFileUpload(inbox) {
  const supportedTypes = [
    'Channel::WebWidget',
    'Channel::FacebookPage',
    'Channel::Whatsapp',
    'Channel::Email',
    'Channel::Api',
    'Channel::Sms',
    'Channel::Telegram',
    'Channel::Line',
    'Channel::Instagram',
  ];
  return supportedTypes.includes(inbox.channel_type) ||
         (inbox.channel_type === 'Channel::TwilioSms' && inbox.medium === 'whatsapp');
}
```

### Multiple File Upload

```javascript
function supportsMultipleFileUpload(inbox) {
  return isEmailChannel(inbox) ||
         isWebWidgetChannel(inbox) ||
         isAPIChannel(inbox) ||
         isWhatsAppChannel(inbox) ||
         isTelegramChannel(inbox);
}
```

### Reply-To Message Feature

```javascript
function supportsReplyTo(inbox) {
  const supportedTypes = [
    'Channel::FacebookPage',
    'Channel::WebWidget',
    'Channel::TwitterProfile',
    'Channel::Whatsapp',
    'Channel::Telegram',
    'Channel::Api',
  ];
  return supportedTypes.includes(inbox.channel_type);
}
```

---

## Conditional Logic Breakdown

### 1. Reply Box Layout Structure

The reply box has these conditional sections:

```
┌─────────────────────────────────┐
│ ReplyTopPanel                    │ ← Always visible
├─────────────────────────────────┤
│ ReplyToMessage                   │ ← Conditional: if reply-to enabled
│ CannedResponse                   │ ← Conditional: if slash command
│ EmojiInput                       │ ← Conditional: if emoji picker open
│ ReplyEmailHead (To/CC/BCC)      │ ← Conditional: Email ONLY
│ AudioRecorder                    │ ← Conditional: if recording audio
│ ┌─────────────────────────────┐ │
│ │ ResizableTextArea           │ │ ← If NOT rich editor
│ │ OR                          │ │
│ │ WootMessageEditor (Rich)    │ │ ← If rich editor
│ └─────────────────────────────┘ │
│ QuotedEmailPreview               │ ← Conditional: Email ONLY
├─────────────────────────────────┤
│ AttachmentPreview                │ ← Conditional: if has attachments
├─────────────────────────────────┤
│ ReplyBottomPanel                 │ ← Always visible
│  - File upload button           │ ← Conditional
│  - Audio recorder button        │ ← Conditional
│  - Emoji button                 │ ← Conditional
│  - WhatsApp templates button   │ ← WhatsApp Cloud ONLY
│  - Content templates button    │ ← Twilio WhatsApp ONLY
│  - Editor toggle button         │ ← API inbox ONLY
│  - Quoted reply toggle         │ ← Email ONLY
└─────────────────────────────────┘
```

### 2. Key Conditional Properties

```javascript
// Channel Detection Helpers
function isEmailChannel(inbox) {
  return inbox.channel_type === 'Channel::Email';
}

function isWhatsAppChannel(inbox) {
  return inbox.channel_type === 'Channel::Whatsapp' ||
         (inbox.channel_type === 'Channel::TwilioSms' && inbox.medium === 'whatsapp');
}

function isWebWidgetChannel(inbox) {
  return inbox.channel_type === 'Channel::WebWidget';
}

function isAPIChannel(inbox) {
  return inbox.channel_type === 'Channel::Api';
}

// Feature Flags
function shouldShowEmailHeader(inbox, isPrivateNote) {
  return !isPrivateNote && isEmailChannel(inbox);
}

function shouldShowWhatsAppTemplates(inbox, isPrivateNote) {
  return !isPrivateNote && 
         inbox.channel_type === 'Channel::Whatsapp' && 
         inbox.provider === 'whatsapp_cloud';
}

function shouldShowContentTemplates(inbox, isPrivateNote) {
  return !isPrivateNote &&
         inbox.channel_type === 'Channel::TwilioSms' &&
         inbox.medium === 'whatsapp';
}

function shouldShowQuotedEmailReply(inbox, isPrivateNote, featureFlags) {
  return isEmailChannel(inbox) &&
         !isPrivateNote &&
         featureFlags.quotedEmailReply === true;
}

function shouldShowEditorToggle(inbox, isPrivateNote) {
  return isAPIChannel(inbox) && !isPrivateNote;
}

function shouldShowReplyToMessage(inbox, inReplyTo, isPrivateNote) {
  const supportsReplyTo = [
    'Channel::FacebookPage',
    'Channel::WebWidget',
    'Channel::TwitterProfile',
    'Channel::Whatsapp',
    'Channel::Telegram',
    'Channel::Api',
  ].includes(inbox.channel_type);
  
  return inReplyTo?.id &&
         !isPrivateNote &&
         supportsReplyTo &&
         !(inbox.channel_type === 'Channel::Whatsapp' && 
           inbox.provider === 'default');  // Exclude 360Dialog
}
```

---

## Message Length Limits

### Per-Channel Limits

```javascript
const MESSAGE_MAX_LENGTH = {
  GENERAL: 10000,
  FACEBOOK: 2000,
  INSTAGRAM: 1000,
  TWILIO_SMS: 320,
  TWILIO_WHATSAPP: 1600,
  WHATSAPP_CLOUD: 4096,
  TELEGRAM: 4096,
  LINE: 2000,
  EMAIL: 25000,
};

function getMaxLength(inbox, isPrivate) {
  if (isPrivate) return MESSAGE_MAX_LENGTH.GENERAL;
  
  switch (inbox.channel_type) {
    case 'Channel::FacebookPage':
      return MESSAGE_MAX_LENGTH.FACEBOOK;
    case 'Channel::Instagram':
      return MESSAGE_MAX_LENGTH.INSTAGRAM;
    case 'Channel::TwilioSms':
      if (inbox.medium === 'whatsapp') {
        return MESSAGE_MAX_LENGTH.TWILIO_WHATSAPP;
      }
      return MESSAGE_MAX_LENGTH.TWILIO_SMS;
    case 'Channel::Whatsapp':
      return MESSAGE_MAX_LENGTH.WHATSAPP_CLOUD;
    case 'Channel::Email':
      return MESSAGE_MAX_LENGTH.EMAIL;
    case 'Channel::Telegram':
      return MESSAGE_MAX_LENGTH.TELEGRAM;
    case 'Channel::Line':
      return MESSAGE_MAX_LENGTH.LINE;
    default:
      return MESSAGE_MAX_LENGTH.GENERAL;
  }
}
```

---

## Refactoring Recommendations

### 1. Create a Channel Feature Service

```javascript
// services/ChannelFeatureService.js

class ChannelFeatureService {
  constructor(inbox, conversation, uiSettings = {}) {
    this.inbox = inbox;
    this.conversation = conversation;
    this.uiSettings = uiSettings;
    this.channelType = inbox.channel_type;
  }
  
  // Channel Type Detection
  isEmail() {
    return this.channelType === 'Channel::Email';
  }
  
  isWhatsApp() {
    return this.channelType === 'Channel::Whatsapp' ||
           (this.channelType === 'Channel::TwilioSms' && this.inbox.medium === 'whatsapp');
  }
  
  isWebWidget() {
    return this.channelType === 'Channel::WebWidget';
  }
  
  isAPI() {
    return this.channelType === 'Channel::Api';
  }
  
  // Editor Configuration
  shouldUseRichEditor(isPrivateNote = false) {
    if (isPrivateNote) return true;
    if (this.isEmail() || this.isWebWidget()) return true;
    if (this.isAPI()) {
      return this.uiSettings.display_rich_content_editor === true;
    }
    return false;
  }
  
  // Feature Flags
  shouldShowEmailHeader(isPrivateNote = false) {
    return !isPrivateNote && this.isEmail();
  }
  
  shouldShowWhatsAppTemplates(isPrivateNote = false) {
    return !isPrivateNote &&
           this.channelType === 'Channel::Whatsapp' &&
           this.inbox.provider === 'whatsapp_cloud';
  }
  
  shouldShowContentTemplates(isPrivateNote = false) {
    return !isPrivateNote &&
           this.channelType === 'Channel::TwilioSms' &&
           this.inbox.medium === 'whatsapp';
  }
  
  supportsFileUpload() {
    // Implementation from feature matrix
  }
  
  supportsMultipleFileUpload() {
    return this.isEmail() || this.isWebWidget() || 
           this.isAPI() || this.isWhatsApp() || 
           this.channelType === 'Channel::Telegram';
  }
  
  supportsReplyTo() {
    const supportedTypes = [
      'Channel::FacebookPage',
      'Channel::WebWidget',
      'Channel::TwitterProfile',
      'Channel::Whatsapp',
      'Channel::Telegram',
      'Channel::Api',
    ];
    return supportedTypes.includes(this.channelType) &&
           !(this.channelType === 'Channel::Whatsapp' && 
             this.inbox.provider === 'default');
  }
  
  // Message Limits
  getMaxMessageLength(isPrivate = false) {
    if (isPrivate) return 10000;
    
    // Implementation from MESSAGE_MAX_LENGTH mapping
    // ... (see message length section)
  }
  
  // Audio Configuration
  getAudioFormat() {
    if (this.isWhatsApp() || this.channelType === 'Channel::Telegram') {
      return 'mp3';
    }
    if (this.isAPI()) {
      return 'mp3';
    }
    return 'wav';
  }
  
  // Message Sending Behavior
  shouldSplitMessagesForWhatsApp() {
    return this.isWhatsApp() || this.channelType === 'Channel::Instagram';
  }
}
```

### 2. Component Architecture Recommendation

```javascript
// components/ReplyBox.vue (pseudo-code)

<template>
  <div class="reply-box" :class="replyBoxClasses">
    <ReplyTopPanel />
    
    <div class="reply-box__content">
      <!-- Conditional: Reply To Message -->
      <ReplyToMessage v-if="features.shouldShowReplyTo" />
      
      <!-- Conditional: Email Header -->
      <ReplyEmailHead v-if="features.shouldShowEmailHeader" />
      
      <!-- Conditional: Audio Recorder -->
      <AudioRecorder v-if="isRecordingAudio" />
      
      <!-- Conditional: Editor Type -->
      <ResizableTextArea 
        v-if="!features.shouldUseRichEditor"
        :max-length="features.maxLength"
      />
      <RichEditor 
        v-else
        :max-length="features.maxLength"
      />
      
      <!-- Conditional: Quoted Email Preview -->
      <QuotedEmailPreview v-if="features.shouldShowQuotedReply" />
    </div>
    
    <!-- Conditional: Attachments -->
    <AttachmentPreview v-if="hasAttachments" />
    
    <ReplyBottomPanel 
      :features="features"
      :supports-file-upload="features.supportsFileUpload"
      :supports-multiple-upload="features.supportsMultipleFileUpload"
    />
    
    <!-- Conditional: WhatsApp Templates -->
    <WhatsAppTemplatesModal v-if="features.shouldShowWhatsAppTemplates" />
    
    <!-- Conditional: Content Templates -->
    <ContentTemplatesModal v-if="features.shouldShowContentTemplates" />
  </div>
</template>

<script setup>
import { useChannelFeatures } from '@/composables/useChannelFeatures';

const props = defineProps({
  inbox: { type: Object, required: true },
  conversation: { type: Object, required: true },
  isPrivateNote: { type: Boolean, default: false },
});

const features = useChannelFeatures(
  props.inbox,
  props.conversation,
  props.isPrivateNote
);
</script>
```

### 3. Composable Pattern (Vue 3)

```javascript
// composables/useChannelFeatures.js

import { computed } from 'vue';
import { ChannelFeatureService } from '@/services/ChannelFeatureService';

export function useChannelFeatures(inbox, conversation, isPrivateNote = false, uiSettings = {}) {
  const service = new ChannelFeatureService(inbox, conversation, uiSettings);
  
  return {
    // Channel type
    isEmail: computed(() => service.isEmail()),
    isWhatsApp: computed(() => service.isWhatsApp()),
    
    // Editor
    shouldUseRichEditor: computed(() => service.shouldUseRichEditor(isPrivateNote)),
    editorType: computed(() => 
      service.shouldUseRichEditor(isPrivateNote) ? 'rich' : 'plain'
    ),
    
    // Features
    shouldShowEmailHeader: computed(() => service.shouldShowEmailHeader(isPrivateNote)),
    shouldShowWhatsAppTemplates: computed(() => service.shouldShowWhatsAppTemplates(isPrivateNote)),
    shouldShowContentTemplates: computed(() => service.shouldShowContentTemplates(isPrivateNote)),
    supportsFileUpload: computed(() => service.supportsFileUpload()),
    supportsMultipleFileUpload: computed(() => service.supportsMultipleFileUpload()),
    shouldShowReplyTo: computed(() => service.supportsReplyTo()),
    
    // Limits
    maxLength: computed(() => service.getMaxMessageLength(isPrivateNote)),
    
    // Audio
    audioFormat: computed(() => service.getAudioFormat()),
    
    // Behavior
    shouldSplitMessages: computed(() => service.shouldSplitMessagesForWhatsApp()),
  };
}
```

### 4. Configuration-Based Approach

```javascript
// config/channelFeatures.js

export const CHANNEL_FEATURES = {
  'Channel::Email': {
    editor: 'rich',
    maxLength: 25000,
    supportsEmailHeader: true,
    supportsQuotedReply: true,
    supportsFileUpload: true,
    supportsMultipleUpload: true,
    supportsReplyTo: false,
    audioFormat: 'wav',
    splitMessages: false,
  },
  'Channel::Whatsapp': {
    editor: 'plain',
    maxLength: 4096,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: true,
    supportsReplyTo: true,
    audioFormat: 'mp3',
    splitMessages: true,
    templates: {
      type: 'whatsapp_cloud',  // Conditional on provider
      enabled: (inbox) => inbox.provider === 'whatsapp_cloud',
    },
  },
  'Channel::WebWidget': {
    editor: 'rich',
    maxLength: 10000,
    supportsEmailHeader: false,
    supportsQuotedReply: false,
    supportsFileUpload: true,
    supportsMultipleUpload: true,
    supportsReplyTo: true,
    audioFormat: 'wav',
    splitMessages: false,
  },
  // ... other channels
};

// Helper function
export function getChannelFeatures(channelType, inbox = {}) {
  const base = CHANNEL_FEATURES[channelType] || CHANNEL_FEATURES['Channel::Api'];
  
  // Handle special cases
  if (channelType === 'Channel::Whatsapp') {
    if (inbox.provider === 'default') {
      base.templates = { enabled: false };
      base.supportsReplyTo = false;  // 360Dialog exclusion
    }
  }
  
  if (channelType === 'Channel::TwilioSms' && inbox.medium === 'whatsapp') {
    return {
      ...CHANNEL_FEATURES['Channel::Whatsapp'],
      templates: {
        type: 'content',
        enabled: true,
      },
      maxLength: 1600,  // Twilio WhatsApp limit
    };
  }
  
  return base;
}
```

### 5. Testing Strategy

```javascript
// tests/ChannelFeatureService.test.js

describe('ChannelFeatureService', () => {
  describe('Email Channel', () => {
    it('should use rich editor', () => {
      const inbox = { channel_type: 'Channel::Email' };
      const service = new ChannelFeatureService(inbox);
      expect(service.shouldUseRichEditor()).toBe(true);
    });
    
    it('should show email header', () => {
      const inbox = { channel_type: 'Channel::Email' };
      const service = new ChannelFeatureService(inbox);
      expect(service.shouldShowEmailHeader()).toBe(true);
    });
  });
  
  describe('WhatsApp Channel', () => {
    it('should use plain editor', () => {
      const inbox = { channel_type: 'Channel::Whatsapp' };
      const service = new ChannelFeatureService(inbox);
      expect(service.shouldUseRichEditor()).toBe(false);
    });
    
    it('should show templates for WhatsApp Cloud', () => {
      const inbox = { 
        channel_type: 'Channel::Whatsapp',
        provider: 'whatsapp_cloud',
      };
      const service = new ChannelFeatureService(inbox);
      expect(service.shouldShowWhatsAppTemplates()).toBe(true);
    });
  });
});
```

---

## Summary

### Key Decision Points

1. **Editor Type**: Determined by `channel_type` (Email/WebWidget = rich, others = plain, API = configurable)
2. **Email Header**: Only for `Channel::Email`
3. **WhatsApp Templates**: Only for `Channel::Whatsapp` with `provider === 'whatsapp_cloud'`
4. **Content Templates**: Only for `Channel::TwilioSms` with `medium === 'whatsapp'`
5. **Message Limits**: Vary by channel type (see MESSAGE_MAX_LENGTH)
6. **File Upload**: Most channels support it, but multiple upload is restricted
7. **Reply-To**: Supported by most channels except Twitter and 360Dialog WhatsApp

### Recommended Refactoring Steps

1. ✅ Extract channel detection logic into a service/composable
2. ✅ Create a configuration object mapping channel types to features
3. ✅ Use computed properties for conditional rendering
4. ✅ Separate concerns: channel detection vs. UI rendering
5. ✅ Add TypeScript types for type safety
6. ✅ Write comprehensive tests for each channel type
7. ✅ Document all channel-specific behaviors

### Critical Data Dependencies

- `inbox.channel_type` - Primary identifier (required)
- `inbox.provider` - For WhatsApp sub-types (optional)
- `inbox.medium` - For Twilio channels (optional)
- `conversation.can_reply` - Determines if reply is allowed
- `uiSettings.display_rich_content_editor` - For API inbox editor toggle

