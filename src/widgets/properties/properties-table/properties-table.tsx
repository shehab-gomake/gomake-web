import { useTranslation } from "react-i18next";

import { AddRuleModal } from "@/pages-components/products/profits-new/widgets/add-rule-modal";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useStyle } from "@/widgets/properties/properties-table/style";

import { EditRulesModal } from "../properties-modals/edit-rule-modal";
import { useProperites } from "../hooks/use-properites";
import { MoreMenuWidget } from "../more-circle";
import { PrimaryTableWithDragAndDrop } from "@/components/tables/primary-table-with-drag-and-drop";

const PropertiesTable = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const {
    openAddRule,
    openEditRule,
    onCloseAddRuleModal,
    onOpenAddRuleModal,
    onCOpenEditModal,
    onCloseEditModal,
    anchorEl,
    open,
    handleClose,
    selectedProperties,
    propertiesData,
    tableHeaders,
    columnWidths,
    router,
    term,
    propertiesDataSearched,
    getProperitesService,
    deleteRule,
    reOrderPricingTables,
    setTerm,
    setProperitesData,
    hiddenData,
    setHiddenData,
    reOrderPropertiesTables,
    updateIsHiddenFromWorkFlow,
    updateIsHiddenFromCalculation,
    ToggleIsShowInOutSourceDetails,
    parameters
  } = useProperites({ classes });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    // Use the currently displayed data (searched or not)
    const currentRows = term ? propertiesDataSearched : propertiesData;

    // Find the actual indices in propertiesData based on the property name
    const sourceRow = currentRows[result.source.index];
    const destRow = currentRows[result.destination.index];

    if (!sourceRow || !destRow) return;

    // Find indices in the full propertiesData array
    const sourceIndexInFull = propertiesData.findIndex(row => row[0] === sourceRow[0]);
    const destIndexInFull = propertiesData.findIndex(row => row[0] === destRow[0]);

    if (sourceIndexInFull === -1 || destIndexInFull === -1) return;

    const reorderedRows = Array.from(propertiesData);
    const [removed] = reorderedRows.splice(sourceIndexInFull, 1);
    reorderedRows.splice(destIndexInFull, 0, removed);
    setProperitesData(reorderedRows);

    const reorderedHiddenData = Array.from(hiddenData);
    const [removedHidden] = reorderedHiddenData.splice(sourceIndexInFull, 1);
    reorderedHiddenData.splice(destIndexInFull, 0, removedHidden);
    setHiddenData(reorderedHiddenData);

    const reOrderData = reorderedHiddenData.map((data, newIndex) => ({
      propertyId: data.propertyId,
      ruleType: data.ruleType,
      index: newIndex
    }));

    reOrderPropertiesTables(reOrderData)
  };

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headerContainer}>
        <HeaderTitleWithSearch
          title={
            router.query.actionName + " " + t("products.actions.properties")
          }
          onChange={(e) => setTerm(e)}
        />
      </div>
      {term ? (
        <PrimaryTableWithDragAndDrop
          stickyFirstCol={false}
          stickyHeader={false}
          rows={propertiesDataSearched}
          headers={tableHeaders}
          columnWidths={columnWidths}
          onDragEnd={onDragEnd}
        />
      ) : (
        <PrimaryTableWithDragAndDrop
          stickyFirstCol={false}
          stickyHeader={false}
          rows={propertiesData}
          headers={tableHeaders}
          columnWidths={columnWidths}
          onDragEnd={onDragEnd}
        />
      )}

      <AddRuleModal
        openModal={openAddRule}
        onCloseModal={onCloseAddRuleModal}
        isPropertiesWidge={true}
        selectedProperties={selectedProperties}
        getProperitesService={getProperitesService}
        parametersStateValue={parameters}
      />
      <EditRulesModal
        openModal={openEditRule}
        onClose={onCloseEditModal}
        selectedProperties={selectedProperties}
        onOpenAddRuleModal={onOpenAddRuleModal}
        deleteRule={deleteRule}
        reOrderPricingTables={reOrderPricingTables}
      />
      <MoreMenuWidget
        onOpenAddRuleModal={onOpenAddRuleModal}
        onCOpenEditModal={onCOpenEditModal}
        handleClose={handleClose}
        anchorEl={anchorEl}
        open={open}
        selectedProperties={selectedProperties}
        updateIsHiddenFromWorkFlow={updateIsHiddenFromWorkFlow}
        updateIsHiddenFromCalculation={updateIsHiddenFromCalculation}
        ToggleIsShowInOutSourceDetails={ToggleIsShowInOutSourceDetails}
      />
    </div>

  );
};

export { PropertiesTable };
