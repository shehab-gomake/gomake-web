import { PrimaryTable } from "@/components/tables/primary-table";
import { useGeneralSettings } from "./use-general-settings";
import { EditModal } from "./components/edit-general-modal/edit-modal";
import { useEffect } from "react";

const GeneralSettingsComponent = () => {
  const {
    tableHeaders,
    columnsWidth,
    handleCloseModal,
    openModal,
    selectedSetting,
    getAllPreferences,
    allPreferences,
    updatePreferences,
  } = useGeneralSettings();

  useEffect(() => {
    getAllPreferences();
  }, []);

  return (
    <div>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={true}
        rows={allPreferences}
        headers={tableHeaders}
        maxHeight={"calc(100vh - 213px)"}
        columnWidths={columnsWidth}
      />
      {openModal && selectedSetting && (
        <EditModal
          openModal={openModal}
          onClose={handleCloseModal}
          selectedSetting={selectedSetting}
          onUpdate={(updatedSetting) => updatePreferences(updatedSetting)}
        />
      )}
    </div>
  );
};
export { GeneralSettingsComponent };
