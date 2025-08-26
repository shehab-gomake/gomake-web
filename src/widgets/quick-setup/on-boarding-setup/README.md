# Quick Setup Modal New

A new modal component for selecting machines and categories in the quick setup process.

## Features

- Select machine categories from a dropdown
- Load machines from the selected category using `adminGetAllMachineByCategory` API
- Add machines to a selected list
- Remove machines from the list with delete functionality
- Save the selected machines list

## Usage

### Basic Usage

```tsx
import {
  QuickSetupModalNew,
  useQuickSetupModalNew,
} from "@/widgets/quick-setup/quick-setup-modal-new";

const MyComponent = () => {
  const { modal, selectedMachines, openModal, handleSave } =
    useQuickSetupModalNew();

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>

      <QuickSetupModalNew
        open={modal.isOpen}
        onClose={modal.close}
        onSave={handleSave}
      />

      {/* Display selected machines */}
      {selectedMachines.map((machine) => (
        <div key={machine.id}>
          {machine.name} - {machine.categoryName}
        </div>
      ))}
    </div>
  );
};
```

### Props

| Prop      | Type     | Required | Description                                                               |
| --------- | -------- | -------- | ------------------------------------------------------------------------- |
| `open`    | boolean  | Yes      | Controls modal visibility                                                 |
| `onClose` | function | Yes      | Callback when modal is closed                                             |
| `onSave`  | function | No       | Callback when save button is clicked, receives array of selected machines |

### Selected Machine Interface

```tsx
interface SelectedMachine {
  id: string;
  name: string;
  category: string;
  categoryName: string;
}
```

## API Integration

The modal uses the `adminGetAllMachineByCategory` API to fetch machines for each category. The API is called automatically when a category is selected.

## Translation Keys

The following translation keys are used:

- `quickSetup.selectMachines` - Modal title
- `quickSetup.addNewMachine` - Section title for adding machines
- `quickSetup.selectedMachines` - Section title for selected machines list
- `quickSetup.loadedMachines` - Status message showing number of loaded machines
- `machineAttributes.category` - Category dropdown label
- `machineAttributes.machine` - Machine dropdown label
- `common.loading` - Loading text
- `common.add` - Add button text
- `common.save` - Save button text
- `common.cancel` - Cancel button text

## Test Page

A test page is included at `test-page.tsx` that demonstrates the modal functionality. You can use this to test the component during development.

