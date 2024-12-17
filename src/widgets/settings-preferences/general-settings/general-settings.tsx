import { PrimaryTable } from "@/components/tables/primary-table";
import { useGeneralSettings } from "./use-general-settings";
import { EditModal } from "./components/edit-general-modal/edit-modal";

const GeneralSettingsComponent = () => {
  const {
    tableHeaders,
    columnsWidth,
    mockData,
    handleCloseModal,
    openModal,
    selectedText,
    selectedSetting,
  } = useGeneralSettings();

  return (
    <div>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={true}
        rows={mockData}
        headers={tableHeaders}
        maxHeight={"calc(100vh - 213px)"}
        columnWidths={columnsWidth}
      />
      <EditModal
        openModal={openModal}
        onClose={handleCloseModal}
        selectedText={selectedText}
        selectedSetting={selectedSetting}
        inputType="select"
        selectOptions={[
          { label: "ss", value: 2 },
          { label: "a", value: 1 },
        ]}
        onUpdate={(updatedSetting) =>
          console.log("Updated Setting:", updatedSetting)
        }
      />
    </div>
  );
};
export { GeneralSettingsComponent };
