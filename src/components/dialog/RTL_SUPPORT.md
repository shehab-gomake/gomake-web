# RTL (Right-to-Left) Support in GoMakeDialog

## 🌍 Overview

The `GoMakeDialog` component now has **full RTL (Right-to-Left) support** for Arabic and Hebrew languages, with automatic detection and layout adjustment based on the current language direction.

---

## ✨ Features

### Automatic Direction Detection
The component automatically detects the current language direction from the translation system:

```typescript
const { t } = useTranslation();
const direction: "rtl" | "ltr" = t("direction");
const isRTL = direction === "rtl";
```

### RTL Layout Adjustments

#### 1. **Dialog Direction**
The entire dialog respects the direction:
```typescript
<Dialog
  PaperProps={{
    sx: { ...classes.paper, direction }, // Sets direction: "rtl" or "ltr"
  }}
>
```

#### 2. **Header Layout**

**LTR (English, German):**
```
┌─────────────────────────────┐
│ Title                    [X]│  ← Close button on right
└─────────────────────────────┘
```

**RTL (Arabic, Hebrew):**
```
┌─────────────────────────────┐
│[X]                    العنوان│  ← Close button on left
└─────────────────────────────┘
```

#### 3. **Footer Button Order**

**LTR (English, German):**
```
┌─────────────────────────────┐
│                [Cancel] [Save]│  ← Cancel left, Save right
└─────────────────────────────┘
```

**RTL (Arabic, Hebrew):**
```
┌─────────────────────────────┐
│[حفظ] [إلغاء]                 │  ← Save left (first), Cancel right
└─────────────────────────────┘
```

#### 4. **Additional Buttons Position**

**LTR (English):**
```
┌─────────────────────────────┐
│[Print] [Export]  [Cancel] [Save]│
│ ↑ Left side      ↑ Right side   │
└─────────────────────────────┘
```

**RTL (Arabic):**
```
┌─────────────────────────────┐
│[حفظ] [إلغاء]  [طباعة] [تصدير]│
│ ↑ Left side   ↑ Right side    │
└─────────────────────────────┘
```

---

## 🎯 How It Works

### 1. Language Detection
The component uses the translation system to detect the current language:

```typescript
const { t } = useTranslation();
const direction: "rtl" | "ltr" = t("direction");
const isRTL = direction === "rtl";
```

- `t("direction")` returns `"rtl"` for Arabic (`ar`) and Hebrew (`he`)
- `t("direction")` returns `"ltr"` for English (`en`) and German (`de`)

### 2. Header Rendering
The close button position is conditional:

```typescript
{/* In RTL, close button comes first */}
{isRTL && showCloseButton && onClose && (
  <IconButton onClick={onClose}>
    <CloseIcon />
  </IconButton>
)}

<Box sx={classes.title}>
  {customTitle || title}
</Box>

{/* In LTR, close button comes after title */}
{!isRTL && showCloseButton && onClose && (
  <IconButton onClick={onClose}>
    <CloseIcon />
  </IconButton>
)}
```

### 3. Footer Button Order
Buttons are reordered based on direction:

```typescript
{isRTL ? (
  <>
    {/* Primary button first in RTL */}
    <PrimaryButton />
    {/* Cancel button second in RTL */}
    <CancelButton />
  </>
) : (
  <>
    {/* Cancel button first in LTR */}
    <CancelButton />
    {/* Primary button second in LTR */}
    <PrimaryButton />
  </>
)}
```

### 4. Additional Buttons Position
Additional buttons swap sides:

```typescript
{/* LTR: Additional buttons on the left */}
{!isRTL && additionalButtons && (
  <Box sx={classes.additionalButtonsContainer}>
    {additionalButtons}
  </Box>
)}

{/* Main action buttons in the middle */}
<Box sx={classes.footerButtonsContainer}>
  {/* ... */}
</Box>

{/* RTL: Additional buttons on the right */}
{isRTL && additionalButtons && (
  <Box sx={classes.additionalButtonsContainer}>
    {additionalButtons}
  </Box>
)}
```

---

## 💡 Usage Examples

### Basic Usage (Works in Any Language)

```typescript
import { GoMakeDialog } from "@/components/dialog";
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <GoMakeDialog
      open={open}
      onClose={() => setOpen(false)}
      title={t("dialog.title")}  // Automatically translated
      primaryButtonLabel={t("common.save")}  // "Save" or "حفظ"
      cancelButtonLabel={t("common.cancel")}  // "Cancel" or "إلغاء"
      onPrimaryAction={handleSave}
    >
      {/* Your content - will respect RTL/LTR */}
      <div>
        {t("dialog.content")}
      </div>
    </GoMakeDialog>
  );
};
```

### With Additional Buttons

```typescript
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title={t("document.title")}
  primaryButtonLabel={t("common.save")}
  onPrimaryAction={handleSave}
  additionalButtons={
    <>
      <Button onClick={handlePrint}>
        {t("common.print")}  // Will be on left (LTR) or right (RTL)
      </Button>
      <Button onClick={handleExport}>
        {t("common.export")}
      </Button>
    </>
  }
>
  <DocumentEditor />
</GoMakeDialog>
```

---

## 🎨 RTL Visual Examples

### English (LTR)
```
┌───────────────────────────────────┐
│ Edit Item                      [X]│
├───────────────────────────────────┤
│                                   │
│  [Name field]                     │
│  [Email field]                    │
│                                   │
├───────────────────────────────────┤
│                  [Cancel]  [Save] │
└───────────────────────────────────┘
```

### Arabic (RTL)
```
┌───────────────────────────────────┐
│[X]                      تحرير العنصر│
├───────────────────────────────────┤
│                                   │
│                     [حقل الاسم]   │
│            [حقل البريد الإلكتروني]│
│                                   │
├───────────────────────────────────┤
│[حفظ]  [إلغاء]                     │
└───────────────────────────────────┘
```

---

## 🔧 Styling Considerations

### Automatic Adjustments

The component automatically adjusts:

1. **Dialog Direction**: Sets `direction: "rtl"` or `"ltr"` on the dialog paper
2. **Button Margins**: 
   - LTR: `marginLeft: "auto"` (pushes buttons to the right)
   - RTL: `marginRight: "auto"` (pushes buttons to the left)
3. **Button Order**: Primary and cancel buttons swap positions
4. **Additional Buttons**: Move from left to right side

### Custom Styles with RTL

If you need to add custom styles that respect RTL:

```typescript
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title={t("dialog.title")}
  customStyles={{
    content: {
      // Use logical properties for RTL-friendly styles
      paddingInlineStart: "20px",  // Left in LTR, Right in RTL
      paddingInlineEnd: "20px",    // Right in LTR, Left in RTL
    },
  }}
>
  {/* Content */}
</GoMakeDialog>
```

---

## 📝 Translation Keys

Make sure your translation files have these keys:

### English (`en.json`)
```json
{
  "direction": "ltr",
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  }
}
```

### Arabic (`ar.json`)
```json
{
  "direction": "rtl",
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "loading": "جاري التحميل..."
  }
}
```

### Hebrew (`he.json`)
```json
{
  "direction": "rtl",
  "common": {
    "save": "שמור",
    "cancel": "ביטול",
    "loading": "טוען..."
  }
}
```

---

## ✅ Testing RTL Support

### How to Test

1. **Change Language**: Use your app's language switcher
2. **Open Dialog**: The layout should automatically adjust
3. **Check Elements**:
   - ✅ Close button moves to correct side
   - ✅ Buttons reorder appropriately
   - ✅ Text aligns correctly
   - ✅ Icons and spacing look natural

### Test Checklist

- [ ] Close button on right (LTR) / left (RTL)
- [ ] Primary button on right (LTR) / left (RTL)
- [ ] Cancel button on left (LTR) / right (RTL)
- [ ] Additional buttons on left (LTR) / right (RTL)
- [ ] Dialog title aligns correctly
- [ ] Content flows in correct direction
- [ ] Button labels are translated
- [ ] Icons display correctly

---

## 🎯 Best Practices

### 1. Always Use Translation Keys
```typescript
// ✅ Good - Translatable
title={t("dialog.title")}
primaryButtonLabel={t("common.save")}

// ❌ Bad - Hardcoded English
title="Edit Item"
primaryButtonLabel="Save"
```

### 2. Use Logical CSS Properties in Custom Content
```typescript
// ✅ Good - RTL-friendly
<Box sx={{ 
  marginInlineStart: "16px",  // Respects direction
  paddingInline: "20px" 
}}>

// ❌ Bad - Fixed direction
<Box sx={{ 
  marginLeft: "16px",  // Always left
  paddingLeft: "20px" 
}}>
```

### 3. Test with Real RTL Languages
- Don't just flip styles manually
- Test with actual Arabic or Hebrew text
- Check for text overflow and alignment issues

### 4. Icons and Symbols
- Most icons work in any direction
- Directional icons (arrows) may need flipping
- Use MUI's built-in RTL support for icons

---

## 🔍 Troubleshooting

### Issue: Dialog not reversing

**Check:**
1. Is `t("direction")` returning the correct value?
2. Is the language changed in i18n?
3. Are translation files loaded?

**Solution:**
```typescript
// Debug the direction
const { t } = useTranslation();
console.log("Direction:", t("direction"));  // Should be "rtl" or "ltr"
```

### Issue: Buttons not reordering

**Check:**
- Component is using the latest version
- No custom footer overriding default behavior

**Solution:**
Update to the latest `GoMakeDialog` component.

### Issue: Content not aligning correctly

**Check:**
- Using fixed directional CSS (margin-left, padding-right)
- Not using logical CSS properties

**Solution:**
Use logical properties:
- `margin-left` → `marginInlineStart`
- `margin-right` → `marginInlineEnd`
- `padding-left` → `paddingInlineStart`
- `padding-right` → `paddingInlineEnd`

---

## 📚 Additional Resources

- [MDN: CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [Material-UI RTL Guide](https://mui.com/material-ui/guides/right-to-left/)
- [i18next Direction](https://www.i18next.com/)

---

## 🎉 Summary

The `GoMakeDialog` component provides **automatic RTL support** with:

✅ **Zero Configuration** - Detects language automatically  
✅ **Smart Layout** - Adjusts header, footer, and buttons  
✅ **Natural UX** - Feels native in any language  
✅ **Consistent** - Same API for all directions  
✅ **Accessible** - Proper ARIA labels in any direction  

Just use the component as normal, and it will automatically adapt to the user's language! 🌍

