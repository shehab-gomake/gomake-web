# GoMakeDialog - Quick Start Guide

## 🚀 Installation

The component is already installed and ready to use!

```tsx
import { GoMakeDialog } from "@/components/dialog";
```

## 🌍 RTL Support

The component **automatically supports RTL (Right-to-Left)** for Arabic and Hebrew! It detects the current language and adjusts the layout automatically.

✅ No configuration needed  
✅ Works with your i18n system  
✅ Buttons, icons, and layout flip automatically

**See `RTL_SUPPORT.md` for detailed RTL documentation.**

## 📋 Common Use Cases

### 1️⃣ Simple Form Dialog

```tsx
const [open, setOpen] = useState(false);

<GoMakeDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Edit Item"
  onPrimaryAction={handleSave}
>
  <TextField label="Name" fullWidth />
  <TextField label="Email" fullWidth />
</GoMakeDialog>
```

### 2️⃣ Confirmation Dialog

```tsx
<GoMakeDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete Item?"
  primaryButtonLabel="Delete"
  cancelButtonLabel="Cancel"
  onPrimaryAction={handleDelete}
>
  <p>Are you sure you want to delete this item?</p>
</GoMakeDialog>
```

### 3️⃣ Info/View-Only Dialog (No Footer)

```tsx
<GoMakeDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Item Details"
  showFooter={false}
>
  <div>View-only content here</div>
</GoMakeDialog>
```

### 4️⃣ With Loading State

```tsx
const [saving, setSaving] = useState(false);

<GoMakeDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Save Changes"
  primaryButtonLoading={saving}
  onPrimaryAction={async () => {
    setSaving(true);
    await saveData();
    setSaving(false);
  }}
>
  <Form />
</GoMakeDialog>
```

### 5️⃣ Success Message (Only OK Button)

```tsx
<GoMakeDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Success!"
  primaryButtonLabel="OK"
  hideCancelButton={true}
  onPrimaryAction={() => setOpen(false)}
>
  <p>✅ Operation completed successfully</p>
</GoMakeDialog>
```

## 🎨 Customization

### Custom Styles

```tsx
<GoMakeDialog
  customStyles={{
    paper: { borderRadius: "20px" },
    header: { backgroundColor: "#f5f5f5" },
    content: { padding: "30px" },
  }}
>
  {/* ... */}
</GoMakeDialog>
```

### Custom Footer

```tsx
<GoMakeDialog
  customFooter={
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button onClick={handleAction1}>Action 1</Button>
      <Button onClick={handleAction2}>Action 2</Button>
    </Box>
  }
>
  {/* ... */}
</GoMakeDialog>
```

### Additional Buttons (Left Side)

```tsx
<GoMakeDialog
  additionalButtons={
    <>
      <Button onClick={handlePrint}>Print</Button>
      <Button onClick={handleExport}>Export</Button>
    </>
  }
  primaryButtonLabel="Save"
  onPrimaryAction={handleSave}
>
  {/* ... */}
</GoMakeDialog>
```

## 🔧 Essential Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | **Required** - Control visibility |
| `onClose` | `function` | Close handler |
| `title` | `string` | Dialog title |
| `children` | `ReactNode` | **Required** - Dialog content |
| `onPrimaryAction` | `function` | Primary button click handler |
| `showFooter` | `boolean` | Show/hide footer (default: true) |
| `primaryButtonLabel` | `string` | Primary button text |
| `cancelButtonLabel` | `string` | Cancel button text |
| `primaryButtonLoading` | `boolean` | Show loading state |
| `primaryButtonDisabled` | `boolean` | Disable primary button |

## 💡 Tips

1. **Use translations**: `title={t("your.translation.key")}`
2. **Loading states**: Set `primaryButtonLoading` during async operations
3. **Form validation**: Use `primaryButtonDisabled` for invalid forms
4. **Consistent styling**: Let the component handle styling, only customize when needed
5. **View-only dialogs**: Use `showFooter={false}` for info displays

## 🔄 Migration from Old Dialog

**Before:**
```tsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>
    <Box>{title}</Box>
    <IconButton onClick={handleClose}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    {content}
  </DialogContent>
</Dialog>
```

**After:**
```tsx
<GoMakeDialog
  open={open}
  onClose={handleClose}
  title={title}
  showFooter={false}
>
  {content}
</GoMakeDialog>
```

## 📚 More Examples

See `example-usage.tsx` for comprehensive examples of all features!

