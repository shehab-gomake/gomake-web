import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useGeneralSettings } from "./use-general-settings";
import { EditModal } from "./components/edit-general-modal/edit-modal";
import { useEffect, useMemo } from "react";
import { PrimaryTable } from "@/components/tables/primary-table";

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
    activeTabIndex,
    setActiveTabIndex,
    groups,
  } = useGeneralSettings();

  useEffect(() => {
    getAllPreferences();
  }, []);

  const filteredRows = useMemo(() => {
    const groupId = groups?.[activeTabIndex]?.id;
    return allPreferences?.filter((row) => {
      const item = row?.[3]?.props?.preferenceItem;
      const tabKey = item?.tabKey || "others";
      return tabKey === groupId;
    });
  }, [allPreferences, activeTabIndex, groups]);

  return (
    <>
      <PrimaryTabsComponent
        tabs={groups?.map((group) => ({ title: group?.name }))}
        selectedColor="secondary"
        selectedTabIndex={activeTabIndex}
        onSelectTab={setActiveTabIndex}
      />
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={true}
        rows={filteredRows}
        headers={tableHeaders}
        maxHeight={"calc(100vh - 213px)"}
        columnWidths={columnsWidth}
      />
      {openModal && selectedSetting && (
        <EditModal
          openModal={openModal}
          onClose={handleCloseModal}
          selectedSetting={selectedSetting}
          onUpdate={updatePreferences}
        />
      )}
    </>
  );
};

export { GeneralSettingsComponent };
