# GoMakeMultiSelect Component

A reusable multi-select dropdown component built with `react-select` that follows the GoMake design system.

## Features

- ✅ Multiple selection with checkboxes
- ✅ Search/filter functionality
- ✅ Custom styling matching GoMake theme
- ✅ RTL support
- ✅ Keyboard navigation
- ✅ Loading and disabled states
- ✅ Customizable placeholder
- ✅ Theme integration with `useGomakeTheme`

## Usage

### Basic Example

```tsx
import { GoMakeMultiSelect } from "@/components";

const MyComponent = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const options = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];

  return (
    <GoMakeMultiSelect
      options={options}
      value={selectedValues}
      onChange={setSelectedValues}
      placeholder="Select options..."
    />
  );
};
```

### With All Props

```tsx
<GoMakeMultiSelect
  options={options}
  value={selectedValues}
  onChange={handleChange}
  placeholder="Select machines..."
  isDisabled={false}
  isLoading={false}
  isClearable={true}
  isSearchable={true}
  closeMenuOnSelect={false}
  hideSelectedOptions={false}
  maxHeight={300}
  width="100%"
  minWidth={180}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `IGoMakeMultiSelectOption[]` | **required** | Array of options to display |
| `value` | `string[]` | `[]` | Array of selected values |
| `onChange` | `(values: string[]) => void` | **required** | Callback when selection changes |
| `placeholder` | `string` | `t("general.select")` | Placeholder text |
| `isDisabled` | `boolean` | `false` | Disable the select |
| `isLoading` | `boolean` | `false` | Show loading state |
| `isClearable` | `boolean` | `false` | Allow clearing all selections |
| `isSearchable` | `boolean` | `true` | Enable search/filter |
| `closeMenuOnSelect` | `boolean` | `false` | Close menu after selection |
| `hideSelectedOptions` | `boolean` | `false` | Hide selected options from list |
| `maxHeight` | `number` | `300` | Maximum height of dropdown menu |
| `width` | `string \| number` | `"100%"` | Width of the component |
| `minWidth` | `string \| number` | `180` | Minimum width of the component |

## Interface

```typescript
export interface IGoMakeMultiSelectOption {
  label: string;
  value: string;
}
```

## Styling

The component automatically applies GoMake theme colors using `useGomakeTheme()`:
- Primary color for borders and accents
- Font family from `FONT_FAMILY.Lexend()`
- RTL support based on translation direction

## Examples

### With Machines

```tsx
const machinesOptions = machines.map((machine) => ({
  value: machine.id,
  label: machine.nickName,
}));

<GoMakeMultiSelect
  options={machinesOptions}
  value={selectedMachines}
  onChange={setSelectedMachines}
  placeholder={t("materials.selectMachines")}
/>
```

### With Clients

```tsx
const clientsOptions = clients.map((client) => ({
  value: client.id,
  label: `${client.name} - ${client.code}`,
}));

<GoMakeMultiSelect
  options={clientsOptions}
  value={selectedClients}
  onChange={setSelectedClients}
  placeholder={t("materials.selectClients")}
  isSearchable={true}
/>
```

### With Confirmation Modal

```tsx
const [pendingValues, setPendingValues] = useState<string[]>([]);
const [showModal, setShowModal] = useState(false);

const handleChange = (newValues: string[]) => {
  if (requiresConfirmation) {
    setPendingValues(newValues);
    setShowModal(true);
  } else {
    setSelectedValues(newValues);
  }
};

<GoMakeMultiSelect
  options={options}
  value={selectedValues}
  onChange={handleChange}
/>
```

## Notes

- The component uses checkboxes for better UX in multi-select scenarios
- Selected options are shown as tags/chips
- Keyboard navigation is fully supported
- The component is fully accessible
- Works seamlessly with both LTR and RTL layouts

## Dependencies

- `react-select` v5.10.2
- `@mui/material` (for Checkbox component)
- GoMake theme system
- GoMake icon library

