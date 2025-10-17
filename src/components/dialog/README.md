# GoMakeDialog Component

A comprehensive, reusable dialog component for the GoMake Web project with customizable header, body, and footer sections.

## Features

- ✅ Customizable header with title and close button
- ✅ Flexible body/content area (accepts any children)
- ✅ Footer with action and cancel buttons
- ✅ Loading state support
- ✅ Custom footer support
- ✅ Additional buttons support
- ✅ Full TypeScript support
- ✅ Follows project's styling patterns
- ✅ Internationalization ready
- ✅ **Automatic RTL support for Arabic and Hebrew** 🌍

## 🌍 RTL (Right-to-Left) Support

The component **automatically detects and supports RTL** for Arabic and Hebrew languages with zero configuration!

- **Automatic direction detection** from i18n
- **Smart layout mirroring** (close button, buttons, alignment)
- **Natural reading flow** in any language
- **No extra configuration needed**

**See [`RTL_SUPPORT.md`](./RTL_SUPPORT.md) for detailed documentation.**  
**See [`RTL_VISUAL_COMPARISON.md`](./RTL_VISUAL_COMPARISON.md) for visual examples.**

## Basic Usage

```tsx
import { GoMakeDialog } from "@/components/dialog";
import { useState } from "react";

const MyComponent = () => {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    // Save logic here
    console.log("Saving...");
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      
      <GoMakeDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Item"
        primaryButtonLabel="Save"
        cancelButtonLabel="Cancel"
        onPrimaryAction={handleSave}
      >
        <div>
          <p>Your content goes here</p>
          <input type="text" placeholder="Enter something..." />
        </div>
      </GoMakeDialog>
    </>
  );
};
```

## Advanced Examples

### With Loading State

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Saving Changes"
  primaryButtonLabel="Save"
  primaryButtonLoading={isSaving}
  primaryButtonDisabled={!isValid}
  onPrimaryAction={handleSave}
>
  <Form />
</GoMakeDialog>
```

### Without Footer

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Information"
  showFooter={false}
>
  <div>This is just informational content</div>
</GoMakeDialog>
```

### With Custom Footer

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Custom Actions"
  customFooter={
    <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
      <Button onClick={handleDelete} color="error">Delete</Button>
      <Button onClick={handleArchive}>Archive</Button>
      <Button onClick={handleSave} variant="contained">Save</Button>
    </Box>
  }
>
  <Content />
</GoMakeDialog>
```

### With Additional Buttons

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Document Editor"
  primaryButtonLabel="Save"
  onPrimaryAction={handleSave}
  additionalButtons={
    <>
      <Button onClick={handlePrint}>Print</Button>
      <Button onClick={handleExport}>Export</Button>
    </>
  }
>
  <Editor />
</GoMakeDialog>
```

### With Icons on Buttons

```tsx
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Save Document"
  primaryButtonLabel="Save"
  primaryButtonIcon={<SaveIcon />}
  cancelButtonIcon={<CancelIcon />}
  onPrimaryAction={handleSave}
>
  <Content />
</GoMakeDialog>
```

### With Custom Styles

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Custom Styled Dialog"
  customStyles={{
    paper: {
      borderRadius: "20px",
      maxHeight: "95vh",
    },
    header: {
      backgroundColor: "#f0f0f0",
      padding: "20px 30px",
    },
    title: {
      fontSize: "22px",
      color: "#000",
    },
    content: {
      padding: "30px",
      backgroundColor: "#fff",
    },
    footer: {
      padding: "20px 30px",
    },
  }}
  onPrimaryAction={handleSave}
>
  <Content />
</GoMakeDialog>
```

### Without Close Button

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Must Complete Action"
  showCloseButton={false}
  primaryButtonLabel="Complete"
  onPrimaryAction={handleComplete}
>
  <div>You must complete this action</div>
</GoMakeDialog>
```

### Only Primary Button (No Cancel)

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Confirm Action"
  primaryButtonLabel="OK"
  hideCancelButton={true}
  onPrimaryAction={handleClose}
>
  <div>Action completed successfully!</div>
</GoMakeDialog>
```

### With Custom Title Component

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  customTitle={
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <WarningIcon color="warning" />
      <span>Warning: Destructive Action</span>
    </Box>
  }
  primaryButtonLabel="Proceed"
  onPrimaryAction={handleDelete}
>
  <Content />
</GoMakeDialog>
```

### Large Dialog with Scrollable Content

```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title="Large Content"
  maxWidth="lg"
  fullWidth
  onPrimaryAction={handleSave}
>
  <Box sx={{ height: '60vh', overflow: 'auto' }}>
    <LargeContent />
  </Box>
</GoMakeDialog>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Controls dialog visibility |
| `onClose` | `() => void` | optional | Callback when dialog should close |
| `title` | `string \| ReactNode` | optional | Dialog title text |
| `customTitle` | `ReactNode` | optional | Custom title component (overrides title) |
| `showCloseButton` | `boolean` | `true` | Show/hide close button in header |
| `children` | `ReactNode` | **required** | Dialog body content |
| `showFooter` | `boolean` | `true` | Show/hide footer section |
| `primaryButtonLabel` | `string` | `"Save"` | Primary button text |
| `cancelButtonLabel` | `string` | `"Cancel"` | Cancel button text |
| `onPrimaryAction` | `() => void` | optional | Primary button click handler |
| `onCancel` | `() => void` | optional | Cancel button click handler (defaults to onClose) |
| `primaryButtonDisabled` | `boolean` | `false` | Disable primary button |
| `primaryButtonLoading` | `boolean` | `false` | Show loading state on primary button |
| `customFooter` | `ReactNode` | optional | Custom footer component (replaces default buttons) |
| `customStyles` | `object` | optional | Custom styles for dialog parts |
| `primaryButtonIcon` | `ReactNode` | optional | Icon for primary button |
| `cancelButtonIcon` | `ReactNode` | optional | Icon for cancel button |
| `hideCancelButton` | `boolean` | `false` | Hide cancel button |
| `hidePrimaryButton` | `boolean` | `false` | Hide primary button |
| `additionalButtons` | `ReactNode` | optional | Additional buttons on the left side of footer |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Max width of dialog |
| `fullWidth` | `boolean` | `true` | Whether dialog takes full width |

## Integration with Existing Code

You can easily replace your existing Dialog usage with GoMakeDialog:

### Before (Your current code):

```tsx
<Dialog
  open={openExtraParametersModal.open}
  onClose={handleClose}
  maxWidth="md"
  fullWidth
  PaperProps={{ sx: { borderRadius: "12px", maxHeight: "80vh" } }}
>
  <DialogTitle>
    <Box>Title</Box>
    <IconButton onClick={handleClose}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    {/* Your content */}
  </DialogContent>
</Dialog>
```

### After (Using GoMakeDialog):

```tsx
<GoMakeDialog
  open={openExtraParametersModal.open}
  onClose={handleClose}
  title={t("materials.childTable.extraParameters.title")}
  maxWidth="md"
  fullWidth
  showFooter={false}
  customStyles={{
    paper: { borderRadius: "12px", maxHeight: "80vh" }
  }}
>
  {/* Your content */}
</GoMakeDialog>
```

## Tips

1. **Use TypeScript**: The component has full TypeScript support with detailed prop types
2. **Internationalization**: Use translation keys for button labels and titles
3. **Custom Styling**: Use `customStyles` prop for specific styling needs
4. **Loading States**: Use `primaryButtonLoading` for async operations
5. **Validation**: Use `primaryButtonDisabled` to prevent actions when form is invalid

