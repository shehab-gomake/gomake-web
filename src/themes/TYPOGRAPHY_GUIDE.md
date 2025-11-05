# Typography System Guide

## Overview

The theme system includes a comprehensive typography system with predefined styles for:

- **Title** - Main page titles (h1, h2)
- **Heading** - Section headings (h3, h4)
- **Label** - Form labels, field labels
- **Sub-label** - Helper text, descriptions
- **Button Text** - Button labels
- **Body** - Paragraphs, default text

## Quick Reference

### Using Typography Variables Directly

```tsx
// Title
<div style={{
  fontFamily: "var(--theme-typography-title-font-family)",
  fontWeight: "var(--theme-typography-title-font-weight)",
  fontSize: "var(--theme-typography-title-font-size)",
  lineHeight: "var(--theme-typography-title-line-height)",
  letterSpacing: "var(--theme-typography-title-letter-spacing)",
  color: "var(--theme-typography-title-color)",
}}>
  Main Title
</div>

// Label
<div style={{
  fontFamily: "var(--theme-typography-label-font-family)",
  fontWeight: "var(--theme-typography-label-font-weight)",
  fontSize: "var(--theme-typography-label-font-size)",
  lineHeight: "var(--theme-typography-label-line-height)",
  color: "var(--theme-typography-label-color)",
}}>
  Field Label
</div>
```

### Using Typography Utility Functions (Recommended)

```tsx
import { getTitleTypography, getLabelTypography, getSubLabelTypography } from '@/utils/typography-utils';

// Title
<div style={getTitleTypography()}>
  Main Title
</div>

// Label
<div style={getLabelTypography()}>
  Field Label
</div>

// Sub-label
<div style={getSubLabelTypography()}>
  Helper text
</div>
```

## Available Typography Styles

### 1. Title Typography

**Use for:** Main page titles, hero headings (h1, h2)

**HP-Client Theme:**

- Font: Forma DJR UI
- Weight: 500 (Medium)
- Size: 32px
- Line Height: 40px
- Color: Black (#000000)

**Base Theme:**

- Font: Heebo
- Weight: 600
- Size: 25px
- Line Height: 32px
- Color: Primary color

### 2. Heading Typography

**Use for:** Section headings (h3, h4)

**HP-Client Theme:**

- Font: Forma DJR UI
- Weight: 500
- Size: 24px
- Line Height: 32px

### 3. Label Typography

**Use for:** Form labels, field labels

**Both Themes:**

- Font: Inter / Heebo
- Weight: 500
- Size: 14px
- Line Height: 20px
- Color: Secondary gray

### 4. Sub-label Typography

**Use for:** Helper text, descriptions, placeholders

**Both Themes:**

- Font: Inter / Heebo
- Weight: 400
- Size: 12px
- Line Height: 18px
- Color: Muted gray

### 5. Button Text Typography

**Use for:** Button labels

**HP-Client Theme:**

- Font: Inter
- Weight: 500
- Size: 16px
- Line Height: 24px

**Base Theme:**

- Font: Lexend
- Weight: 500
- Size: 16px

### 6. Body Text Typography

**Use for:** Paragraphs, default text

**Both Themes:**

- Font: Inter / Heebo
- Weight: 400
- Size: 14-16px
- Line Height: 21-24px

## Typography Variables Reference

### CSS Variables (in theme.config.ts)

```typescript
// Title
"--theme-typography-title-font-family";
"--theme-typography-title-font-weight";
"--theme-typography-title-font-size";
"--theme-typography-title-line-height";
"--theme-typography-title-letter-spacing";
"--theme-typography-title-color";

// Heading
"--theme-typography-heading-font-family";
"--theme-typography-heading-font-weight";
"--theme-typography-heading-font-size";
"--theme-typography-heading-line-height";
"--theme-typography-heading-letter-spacing";
"--theme-typography-heading-color";

// Label
"--theme-typography-label-font-family";
"--theme-typography-label-font-weight";
"--theme-typography-label-font-size";
"--theme-typography-label-line-height";
"--theme-typography-label-letter-spacing";
"--theme-typography-label-color";

// Sub-label
"--theme-typography-sublabel-font-family";
"--theme-typography-sublabel-font-weight";
"--theme-typography-sublabel-font-size";
"--theme-typography-sublabel-line-height";
"--theme-typography-sublabel-letter-spacing";
"--theme-typography-sublabel-color";

// Button
"--theme-typography-button-font-family";
"--theme-typography-button-font-weight";
"--theme-typography-button-font-size";
"--theme-typography-button-line-height";
"--theme-typography-button-letter-spacing";

// Body
"--theme-typography-body-font-family";
"--theme-typography-body-font-weight";
"--theme-typography-body-font-size";
"--theme-typography-body-line-height";
"--theme-typography-body-letter-spacing";
"--theme-typography-body-color";
```

## Examples

### Example 1: Title

```tsx
// In quote widget - already updated!
const titleStyle = {
  fontFamily:
    "var(--theme-typography-title-font-family, 'Forma DJR UI', sans-serif)",
  fontWeight: "var(--theme-typography-title-font-weight, 500)",
  fontSize: "var(--theme-typography-title-font-size, 32px)",
  lineHeight: "var(--theme-typography-title-line-height, 40px)",
  letterSpacing: "var(--theme-typography-title-letter-spacing, 0px)",
  color: "var(--theme-typography-title-color, #000000)",
};
```

### Example 2: Label (Form Field)

```tsx
<label
  style={{
    ...getLabelTypography(),
    display: "block",
    marginBottom: "8px",
  }}
>
  Select customer
</label>
```

### Example 3: Sub-label (Helper Text)

```tsx
<p style={getSubLabelTypography()}>Please choose a product from the dropdown</p>
```

## Best Practices

### ✅ DO THIS

1. **Use typography variables** for all text elements
2. **Use utility functions** (`getTitleTypography()`) for consistency
3. **Override only when needed** - stick to theme defaults
4. **Match semantic meaning** - Use "Title" for titles, "Label" for labels

### ❌ DON'T DO THIS

1. Don't hardcode font sizes/weights
2. Don't mix typography styles (e.g., Title font for buttons)
3. Don't forget fallbacks in CSS variables

## Customizing Typography

Edit `src/themes/hp-client/theme.config.ts` or `src/themes/base/theme.config.ts`:

```typescript
// Change title font size
"--theme-typography-title-font-size": "36px", // Was 32px

// Change label color
"--theme-typography-label-color": "#333333", // Was #4a5568

// Change button font
"--theme-typography-button-font-family": '"Custom Font", sans-serif',
```

## Forma DJR UI Font

**Important:** Forma DJR UI font needs to be loaded before it can be used.

### Option 1: Load via @font-face

Add to `globals.css` or a custom stylesheet:

```css
@font-face {
  font-family: "Forma DJR UI";
  src: url("/fonts/FormaDJRUI-Regular.woff2") format("woff2"), url("/fonts/FormaDJRUI-Regular.woff")
      format("woff");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Forma DJR UI";
  src: url("/fonts/FormaDJRUI-Medium.woff2") format("woff2"), url("/fonts/FormaDJRUI-Medium.woff")
      format("woff");
  font-weight: 500;
  font-style: normal;
}
```

### Option 2: Self-hosted

If you have the font files, place them in `public/fonts/` and reference as above.

### Option 3: Font Service

If using a font service (Adobe Fonts, etc.), add the link to `_document.page.tsx`.

---

**The title in the quote widget now uses the HP-Client theme typography!** 🎉
