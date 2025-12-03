# Advanced Email Editor Guide

## Overview

The Advanced Email Editor is a powerful, modern replacement for the previous Quill editor. Built with TipTap (a headless editor framework), it provides superior design control, better extensibility, and enhanced features for creating professional email templates.

## Key Features

### 1. **Enhanced Text Formatting**
- **Bold, Italic, Underline, Strikethrough** - Complete text styling options
- **Headings** - H1, H2, H3 support for structured content
- **Lists** - Bullet points and numbered lists
- **Text Alignment** - Left, Center, Right, and Justify
- **Text Color** - Full color picker for custom text colors
- **Undo/Redo** - Complete history management

### 2. **Template Variable Buttons**
The revolutionary feature of this editor is how template variables are displayed:

- **Visual Buttons**: Instead of plain text links, template variables appear as styled, interactive buttons
- **Color-Coded**: Buttons use your brand color (#5048ED) with hover effects
- **Clickable Links**: If a variable has a URL (like "Payment Link" or "Quote Link"), clicking the button opens the link
- **Easy Insertion**: Click any variable from the scrollable list at the bottom to insert it into your email

### 3. **Template Variables**
Available template variables include:
- Payment Link (opens payment page when clicked)
- Quote Link (opens quote page when clicked)
- Customer Name
- Order Number
- And more... (fetched from backend)

### 4. **Rich Toolbar**
The editor features a comprehensive toolbar with:
- Text formatting controls
- Alignment options
- List creation
- Link insertion
- Color picker
- History controls (undo/redo)

### 5. **RTL/LTR Support**
Fully supports both right-to-left (RTL) and left-to-right (LTR) text direction based on the selected language.

## Technical Implementation

### Architecture

```
advanced-email-editor.tsx          # Main editor component
extensions/
  ├── template-variable-button.ts  # Custom TipTap node for variables
  └── template-variable-button-component.tsx  # React component for button rendering
advanced-email-editor-styles.ts    # MUI-based styles
```

### Custom Node: Template Variable Button

The editor uses a custom TipTap node extension that:
1. Creates inline button elements in the editor
2. Stores metadata (marker, title, url)
3. Renders as interactive MUI buttons
4. Handles click events to open links

### Integration

The editor integrates seamlessly with:
- **Recoil State**: For managing email subject and body
- **i18n**: For multilingual support
- **MUI Theme**: Consistent with your design system
- **Backend API**: Template variables fetched dynamically

## Usage

### Basic Usage

```tsx
import { AdvancedEmailEditor } from './advanced-email-editor';

const MyComponent = () => {
  const [content, setContent] = useState('');
  
  return (
    <AdvancedEmailEditor 
      value={content} 
      setValue={setContent} 
    />
  );
};
```

### Adding Template Variables

Template variables are automatically loaded from the backend and displayed in a scrollable menu below the editor. Users can:

1. Click any variable button in the menu
2. The variable is inserted at the cursor position as a styled button
3. The button displays the variable title (e.g., "Payment Link")
4. When recipients click the button in the email, it opens the associated URL

## Styling

### Button Appearance
```css
Background: #5048ED (brand purple)
Hover: #3d38c4 (darker purple)
Border Radius: 6px
Box Shadow: Soft shadow for depth
Font: Inter, 500 weight, 13px
```

### Editor Container
```css
Border: 1px solid #e0e0e0
Border Radius: 8px
Background: White
Min Height: 200px
Padding: 12px
```

## Customization

### Adding New Extensions

To add new TipTap extensions:

```tsx
const editor = useEditor({
  extensions: [
    // ... existing extensions
    YourCustomExtension.configure({
      // options
    }),
  ],
});
```

### Styling Customization

Modify `advanced-email-editor-styles.ts` to customize:
- Editor content styles
- ProseMirror element styles
- Heading styles
- Link styles
- List styles

### Toolbar Customization

Add new toolbar buttons in `advanced-email-editor.tsx`:

```tsx
<Tooltip title="Your Feature">
  <IconButton
    size="small"
    onClick={() => editor.chain().focus().yourCommand().run()}
    sx={{
      backgroundColor: editor.isActive('yourFeature') ? '#5048ED' : 'transparent',
      // ... styles
    }}
  >
    <YourIcon fontSize="small" />
  </IconButton>
</Tooltip>
```

## Migration from Quill

The old `QuillEditor` component has been replaced with `AdvancedEmailEditor` in:
- Subject field
- Body field  
- Special body fields (per body type)

### Key Differences

| Feature | Quill | TipTap (Advanced) |
|---------|-------|-------------------|
| Template Variables | Text badges | Interactive buttons |
| Extensibility | Limited | Highly extensible |
| TypeScript Support | Partial | Full |
| Custom Nodes | Complex | Easy with Node API |
| Performance | Good | Excellent |
| Bundle Size | ~140KB | ~100KB |

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (use modern browsers)

## Performance

- Lazy loading: Not needed (TipTap is lightweight)
- Optimistic rendering: Yes
- Debounced updates: Available via `onUpdate`
- Virtual scrolling: Not needed for editor content

## Troubleshooting

### TypeScript Errors
If you see module resolution errors:
1. Restart TypeScript server in VS Code/Cursor
2. Run `npm install` to ensure packages are installed
3. Check `package.json` for @tiptap dependencies

### Styling Issues
If buttons don't appear correctly:
1. Ensure global CSS is loaded (check `src/styles/globals.css`)
2. Verify MUI theme is available
3. Check browser console for CSS errors

### Variables Not Loading
If template variables don't appear:
1. Check API endpoint is returning data
2. Verify `templateVariables` prop from `useMessageTemplate`
3. Check browser console for errors

## Future Enhancements

Potential future features:
- [ ] Image upload support
- [ ] Table creation
- [ ] Emoji picker
- [ ] Font size selector
- [ ] Background color
- [ ] Advanced link options
- [ ] Template preview mode
- [ ] HTML source view
- [ ] Markdown import/export

## Support

For issues or questions:
1. Check this documentation
2. Review TipTap docs: https://tiptap.dev/
3. Check the component source code
4. Contact the development team

## Version History

### v1.0.0 (Current)
- Initial release
- Replaces Quill editor
- Custom button nodes for template variables
- Full RTL/LTR support
- Rich formatting toolbar
- MUI integration

