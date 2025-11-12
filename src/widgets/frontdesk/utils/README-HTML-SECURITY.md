# HTML Email Security - Production Implementation

## Overview

This implementation provides **production-ready HTML sanitization** for email content in the FrontDesk tickets feature using **DOMPurify**, following 2025 security best practices.

## Security Threat: XSS (Cross-Site Scripting)

Without sanitization, rendering raw HTML email content can allow attackers to inject malicious JavaScript:

```html
<!-- DANGEROUS: Unsanitized email HTML -->
<p>Click here: <a href="#" onclick="stealCookies()">Link</a></p>
<img src="x" onerror="alert('XSS')" />
<script>window.location='evil.com'</script>
```

## Solution: DOMPurify Sanitization

All HTML content is sanitized **before rendering** to strip dangerous elements while preserving safe formatting.

### Implementation Files

1. **`html-sanitizer.ts`** - Core sanitization logic
   - DOMPurify configuration for email HTML
   - Whitelist of safe HTML tags and attributes
   - Link security (adds `rel="noopener noreferrer"`)
   - Helper functions for truncation and text extraction

2. **`text-formatter.ts`** - Smart content formatting
   - Auto-detects HTML vs plain text
   - Sanitizes HTML content
   - Formats plain text (linkify, line breaks)

3. **`MessageItem.tsx`** - React component
   - Uses `smartFormatContent()` for safe rendering
   - Displays sanitized HTML via `dangerouslySetInnerHTML`
   - Includes security comments

## What Gets Sanitized?

### ✅ Allowed (Safe HTML)
- Text formatting: `<p>`, `<div>`, `<span>`, `<br>`, `<strong>`, `<em>`, etc.
- Headings: `<h1>` - `<h6>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Links: `<a href="...">` (with forced security attributes)
- Images: `<img src="..." alt="...">`
- Tables: `<table>`, `<tr>`, `<td>`, `<th>`, etc.
- Quotes: `<blockquote>`
- Inline styles: `style="color: red"` (for email formatting)

### ❌ Blocked (Dangerous)
- JavaScript: `<script>`, `onclick`, `onerror`, `oninput`, etc.
- Iframes: `<iframe>` (could load external content)
- Forms: `<form>`, `<input>`, `<button>` (could submit data)
- Dangerous URLs: `javascript:`, `data:`, `vbscript:`
- Meta tags: `<meta>`, `<link>`, `<base>`

## Usage Example

```typescript
import { smartFormatContent } from '@/widgets/frontdesk/utils/text-formatter';

// Automatically sanitizes HTML
const safeHtml = smartFormatContent(
  message.content,
  message.html
);

// Safe to render
<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

## Security Features

1. **XSS Prevention** - All JavaScript stripped
2. **Link Security** - All links get `target="_blank" rel="noopener noreferrer"`
3. **URL Validation** - Only safe protocols allowed (http, https, mailto, tel)
4. **Attribute Whitelist** - Only safe attributes preserved
5. **Safe Defaults** - If sanitization fails, returns empty string

## Performance

- **Fast**: DOMPurify is highly optimized
- **Client-side**: Runs in browser (no server overhead)
- **Cached**: React memoization prevents re-sanitizing

## Testing

To verify sanitization is working:

1. **XSS Test**: Send a ticket message with:
   ```html
   <p>Test <script>alert('XSS')</script></p>
   ```
   Expected: Only "Test" appears, no alert

2. **Safe HTML Test**: Send a ticket message with:
   ```html
   <p><strong>Bold</strong> text with <a href="https://google.com">link</a></p>
   ```
   Expected: Renders with formatting and clickable link

3. **Image Test**: Send HTML with image:
   ```html
   <img src="https://via.placeholder.com/150" alt="Test" />
   ```
   Expected: Image displays

## Alternative: Iframe Sandbox

For **maximum security** (if needed in the future), consider iframe sandbox:

```typescript
<iframe
  sandbox="allow-popups allow-popups-to-escape-sandbox"
  srcDoc={sanitizedHtml}
  style={{ width: '100%', border: 'none' }}
/>
```

Benefits:
- Complete isolation from parent page
- JavaScript cannot access window.parent
- Additional layer of security

Drawbacks:
- More complex implementation
- Height calculation challenges
- Styling limitations

## Resources

- [DOMPurify GitHub](https://github.com/cure53/DOMPurify)
- [React Security Best Practices 2025](https://corgea.com/Learn/react-security-best-practices-2025)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## Maintenance

- Keep DOMPurify updated: `npm update dompurify`
- Review security logs for sanitization failures
- Test with real-world email HTML samples
- Monitor for new XSS attack vectors
