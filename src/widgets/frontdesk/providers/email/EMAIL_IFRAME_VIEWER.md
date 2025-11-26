# Email Iframe Viewer - Implementation Guide

## Overview

This document describes the new sandboxed iframe-based email viewer implementation for FrontDesk. The new viewer provides Gmail/Outlook-quality email rendering with complete CSS isolation, inline image support, and privacy controls.

## ✨ Features

### Security & Privacy
- ✅ **Sandboxed iframe** - Complete isolation from parent application
- ✅ **No script execution** - `sandbox` attribute blocks all JavaScript
- ✅ **External image blocking** - Privacy-first approach with user override
- ✅ **CID image support** - Inline embedded images display correctly
- ✅ **Per-sender preferences** - Remember image display choices

### User Experience
- ✅ **Auto-resizing iframe** - Dynamically adjusts height to content
- ✅ **Responsive layout** - Mobile-first design
- ✅ **Gmail-style header** - Clean metadata display
- ✅ **Quoted reply styling** - Clear visual hierarchy for threads
- ✅ **Attachment filtering** - Separates inline vs downloadable attachments

## 📦 Components

### 1. **EmailMessageBody** (Main Component)

Complete email viewer integrating all features.

```tsx
import { EmailMessageBody } from '@/widgets/frontdesk/providers/email/components';

<EmailMessageBody
  message={emailMessage}
  accountId={accountId}
  persistImagePreferences={true}
  customIframeStyles="body { font-size: 16px; }"
/>
```

**Props:**
- `message: EmailMessage` - Email message to display
- `accountId: string` - Account ID for attachment downloads
- `persistImagePreferences?: boolean` - Save image display preferences (default: true)
- `customIframeStyles?: string` - Additional CSS for iframe

---

### 2. **EmailFrame** (Iframe Renderer)

Sandboxed iframe for HTML rendering.

```tsx
import { EmailFrame } from '@/widgets/frontdesk/providers/email/components';

<EmailFrame
  htmlContent={emailHtml}
  attachments={emailAttachments}
  allowExternalImages={true}
  onProcessed={(metadata) => {
    console.log(`Replaced ${metadata.cidImagesReplaced} inline images`);
  }}
/>
```

**Props:**
- `htmlContent: string` - Raw HTML from email
- `attachments?: EmailAttachment[]` - Attachments for CID processing
- `allowExternalImages?: boolean` - Display external images (default: false)
- `customStyles?: string` - Additional iframe CSS
- `onHeightChange?: (height: number) => void` - Callback when height changes
- `onProcessed?: (metadata) => void` - Callback with processing stats

---

### 3. **EmailHeader** (Metadata Display)

Gmail-style email header with metadata.

```tsx
import { EmailHeader } from '@/widgets/frontdesk/providers/email/components';

<EmailHeader
  subject={message.subject}
  from={message.from}
  to={message.to}
  cc={message.cc}
  date={message.date}
  hasExternalImages={true}
  onAllowExternalImages={() => setAllowImages(true)}
  externalImagesAllowed={allowImages}
/>
```

**Props:**
- `subject: string` - Email subject
- `from: EmailRecipient[]` - Sender information
- `to: EmailRecipient[]` - Primary recipients
- `cc?: EmailRecipient[]` - CC recipients
- `bcc?: EmailRecipient[]` - BCC recipients
- `date: string` - Email timestamp
- `hasExternalImages?: boolean` - Show "Display images" prompt
- `onAllowExternalImages?: () => void` - Callback when user allows images
- `externalImagesAllowed?: boolean` - Current external image state

---

## 🔧 Hooks

### **useEmailContentProcessor**

Processes email HTML for secure iframe rendering.

```tsx
import { useEmailContentProcessor } from '@/widgets/frontdesk/providers/email/components';

const processed = useEmailContentProcessor({
  htmlContent: message.html,
  attachments: message.attachments,
  allowExternalImages: false,
  customStyles: 'body { color: red; }'
});

console.log(processed.cidImagesReplaced); // 3
console.log(processed.hasExternalImages); // true
console.log(processed.externalImageUrls); // ['https://example.com/image.jpg']
```

**Returns:**
```typescript
{
  html: string;                  // Final HTML for iframe srcDoc
  cidImagesReplaced: number;     // Number of CID images replaced
  hasExternalImages: boolean;    // Whether HTML contains external images
  externalImageUrls: string[];   // List of external image URLs
  missingCids: string[];         // CIDs without matching attachments
}
```

---

### **useExternalImageControl**

Manages external image display preferences.

```tsx
import { useExternalImageControl } from '@/widgets/frontdesk/providers/email/components';

const { allowed, allowImages, blockImages, toggleImages } = useExternalImageControl({
  emailId: message.id,
  senderEmail: message.from[0]?.email,
  persist: true
});

// Usage:
<Button onClick={allowImages}>Display Images</Button>
<EmailFrame allowExternalImages={allowed} />
```

**Options:**
- `emailId?: string` - Email ID for per-email preference
- `senderEmail?: string` - Sender for per-sender preference
- `persist?: boolean` - Save preference to localStorage (default: false)

**Returns:**
```typescript
{
  allowed: boolean;          // Whether external images are allowed
  allowImages: () => void;   // Allow external images
  blockImages: () => void;   // Block external images
  toggleImages: () => void;  // Toggle external images
}
```

---

## 🔐 Security Architecture

### Iframe Sandbox

The iframe uses the `sandbox` attribute with minimal permissions:

```html
<iframe
  srcDoc="..."
  sandbox="allow-popups allow-popups-to-escape-sandbox"
  ...
/>
```

**What's Blocked:**
- ❌ JavaScript execution (`allow-scripts` NOT set)
- ❌ Same-origin access (`allow-same-origin` NOT set)
- ❌ Form submission
- ❌ Downloads
- ❌ Fullscreen
- ❌ Pointer lock

**What's Allowed:**
- ✅ Popups (for opening links in new tabs)

### Content Security

1. **CID Image Processing** - Replaces `cid:` URLs with data URLs before rendering
2. **External Image Blocking** - Strips `src` attributes from external images by default
3. **HTML Sanitization** - All HTML is processed before iframe injection
4. **Base Stylesheet** - Provides safe, tested CSS for email rendering

---

## 📊 CID Image Processing

### How It Works

1. **Email arrives** with HTML like:
   ```html
   <img src="cid:image001@example.com" alt="Logo">
   ```

2. **Email has attachment** with:
   ```json
   {
     "id": "image001@example.com",
     "filename": "logo.png",
     "mimeType": "image/png",
     "data": "iVBORw0KGgoAAAANSUhEUgAA..." // base64
   }
   ```

3. **Processor matches** CID to attachment:
   ```typescript
   processCidImages(html, attachments);
   ```

4. **HTML is transformed** to:
   ```html
   <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="Logo">
   ```

5. **Image displays** inline in the email body!

### Utility Functions

```typescript
import {
  processCidImages,
  hasCidImages,
  extractCidImageInfo
} from '@/widgets/frontdesk/providers/email/components';

// Check if email has CID images
const hasCids = hasCidImages(emailHtml);

// Process CID images
const { processedHtml, replacedCount, missingCids } = processCidImages(
  emailHtml,
  attachments
);

// Extract CID info for debugging
const cidInfo = extractCidImageInfo(emailHtml, attachments);
// [{ cid: 'image001@example.com', dataUrl: 'data:image/png;base64,...' }]
```

---

## 🎨 Styling & Customization

### Base Stylesheet

All emails receive a base stylesheet for consistent rendering:

- **Reset & normalization** - Box-sizing, margins
- **Responsive images** - Max-width: 100%
- **Typography** - Headings, paragraphs, line-height
- **Lists** - Proper spacing and indentation
- **Tables** - Border-collapse, consistent padding
- **Blockquotes** - Gmail-style quoted reply styling
- **Mobile responsive** - Media queries for small screens

### Custom Styles

You can inject additional CSS via `customIframeStyles`:

```tsx
<EmailFrame
  htmlContent={html}
  customStyles={`
    body {
      font-size: 16px;
      background-color: #f5f5f5;
    }
    blockquote {
      border-left-color: red;
    }
  `}
/>
```

---

## 📱 Responsive Design

The iframe viewer is mobile-first:

```css
@media (max-width: 640px) {
  body {
    padding: 12px;
    font-size: 13px;
  }

  /* Force tables to be responsive */
  table[width] {
    width: 100% !important;
  }

  /* Stack floating images */
  img[align='left'],
  img[align='right'] {
    display: block;
    float: none !important;
    margin: 8px 0;
  }
}
```

---

## 🔄 Integration with Existing Code

### Option 1: Standalone Usage (Recommended for New Code)

Replace the entire message rendering with `EmailMessageBody`:

```tsx
import { EmailMessageBody } from '@/widgets/frontdesk/providers/email/components';

// In your email viewer:
{messages.map(message => (
  <EmailMessageBody
    key={message.id}
    message={message}
    accountId={accountId}
  />
))}
```

### Option 2: Gradual Migration (For Existing Code)

Add a feature flag to switch between old and new rendering:

```tsx
import { EmailMessageBody } from '@/widgets/frontdesk/providers/email/components';
import { MessageItem } from '@/widgets/frontdesk/components/shared/MessageItem';

const USE_IFRAME_VIEWER = true; // Feature flag

{messages.map(message => {
  if (USE_IFRAME_VIEWER && variant === 'email') {
    return (
      <EmailMessageBody
        key={message.id}
        message={message}
        accountId={accountId}
      />
    );
  }

  // Fall back to current rendering
  const unifiedMessage = emailToUnified(message, accountId);
  return (
    <MessageItem
      key={message.id}
      message={unifiedMessage}
      variant="email"
      accountId={accountId}
    />
  );
})}
```

### Option 3: Modify MessageItem (For Shared Component)

Update `MessageItem.tsx` to use iframe rendering for email variant:

```tsx
// In MessageItem.tsx
import { EmailFrame } from '@/widgets/frontdesk/providers/email/components';

// Replace dangerouslySetInnerHTML section:
{variant === 'email' && message.html ? (
  // New: Use sandboxed iframe for emails
  <EmailFrame
    htmlContent={message.html}
    attachments={message.attachments}
    allowExternalImages={externalImagesAllowed}
  />
) : (
  // Old: Keep dangerouslySetInnerHTML for other variants
  <Box
    dangerouslySetInnerHTML={{ __html: content }}
  />
)}
```

---

## 🧪 Testing

### Test Scenarios

1. **CID Images**
   - ✅ Email with inline images displays correctly
   - ✅ Missing CID attachments are logged
   - ✅ Multiple CID images in one email

2. **External Images**
   - ✅ External images blocked by default
   - ✅ "Display images" prompt shows
   - ✅ Click "Display images" loads external content
   - ✅ Preference persists across sessions

3. **Complex HTML**
   - ✅ Marketing emails with tables
   - ✅ Nested blockquotes (reply threads)
   - ✅ Images with alignment attributes
   - ✅ Emails with custom fonts/colors

4. **Responsive**
   - ✅ Desktop layout (wide)
   - ✅ Mobile layout (narrow)
   - ✅ Tablet layout (medium)

5. **Security**
   - ✅ `<script>` tags are blocked
   - ✅ `onclick` handlers don't execute
   - ✅ XSS payloads are neutralized

### Example Test Data

```typescript
const testEmail: EmailMessage = {
  id: 'test-1',
  subject: 'Test Email with Images',
  from: [{ email: 'sender@example.com', name: 'Sender' }],
  to: [{ email: 'me@example.com', name: 'Me' }],
  date: new Date().toISOString(),
  text: 'Plain text version',
  html: `
    <p>Hello!</p>
    <img src="cid:logo@example.com" alt="Logo">
    <img src="https://example.com/banner.jpg" alt="Banner">
    <blockquote>
      This is a quoted reply.
    </blockquote>
  `,
  attachments: [
    {
      id: 'logo@example.com',
      filename: 'logo.png',
      mimeType: 'image/png',
      size: 5000,
      data: 'iVBORw0KGgoAAAANSUhEUgAA...' // base64
    }
  ]
};
```

---

## 📝 API Reference

### Types

```typescript
interface EmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: EmailRecipient[];
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  bcc?: EmailRecipient[];
  date: string;
  text: string;           // Plain text content
  html?: string;          // HTML content (optional)
  attachments?: EmailAttachment[];
}

interface EmailRecipient {
  email: string;
  name?: string;
}

interface EmailAttachment {
  id?: string;            // Content-ID for inline images
  filename: string;
  mimeType?: string;
  contentType?: string;
  size: number;
  data?: string;          // base64 encoded data
}
```

---

## 🚀 Future Enhancements (Phase 2)

- [ ] **Dark mode** - Theme-aware email rendering
- [ ] **Print view** - Optimized layout for printing
- [ ] **Image lightbox** - Click to view full-size
- [ ] **Collapsible quotes** - Hide long reply threads
- [ ] **Email actions** - Reply inline from header
- [ ] **Keyboard navigation** - Up/down arrow keys
- [ ] **Search highlighting** - Highlight search terms in content

---

## 🐛 Troubleshooting

### CID Images Not Displaying

**Problem:** `<img src="cid:...">` shows broken image icon.

**Solution:**
1. Check attachment has matching `id` field
2. Verify attachment `data` is base64 encoded
3. Check console for "Missing attachment for CID" warnings
4. Use `extractCidImageInfo()` to debug

### External Images Not Loading

**Problem:** External images don't load even after clicking "Display images".

**Solution:**
1. Check `allowExternalImages` prop is set to `true`
2. Verify `useExternalImageControl` hook is used correctly
3. Clear localStorage: `localStorage.removeItem('frontdesk.email.externalImages')`

### Iframe Height Issues

**Problem:** Iframe shows scrollbar or cuts off content.

**Solution:**
1. Check browser console for `postMessage` errors
2. Verify `ResizeObserver` is supported (all modern browsers)
3. Add `onHeightChange` callback to debug height updates

### Styles Not Applied

**Problem:** Email looks unstyled or broken.

**Solution:**
1. Check base stylesheet is injected (view iframe source)
2. Verify `customStyles` prop is valid CSS
3. Look for CSS conflicts in browser DevTools

---

## 📚 Additional Resources

- **Email HTML Best Practices**: https://www.campaignmonitor.com/dev-resources/guides/coding/
- **Iframe Sandbox**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
- **ResizeObserver API**: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver

---

## 💡 Summary

The new iframe-based email viewer provides:

1. ✅ **Security** - Sandboxed iframe prevents XSS and style conflicts
2. ✅ **Privacy** - External images blocked by default
3. ✅ **Functionality** - CID images, attachments, responsive layout
4. ✅ **UX** - Gmail-style header, auto-resize, quoted reply styling
5. ✅ **Flexibility** - Easy to integrate, customizable, well-documented

Ready to use in production! 🎉
