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
    const reorderedRows = Array.from(propertiesData);
    const [removed] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, removed);
    setProperitesData(reorderedRows);

    const reorderedHiddenData = Array.from(hiddenData);
    const [removedHidden] = reorderedHiddenData.splice(result.source.index, 1);
    reorderedHiddenData.splice(result.destination.index, 0, removedHidden);
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
          onDragEnd={onDragEnd}
          columnWidths={["10%", "15%", "10%", "20%", "25%", "10%", "10%",]}
        />
      ) : (
        <PrimaryTableWithDragAndDrop
          stickyFirstCol={false}
          stickyHeader={false}
          rows={propertiesData}
          headers={tableHeaders}
          onDragEnd={onDragEnd}
          columnWidths={["10%", "15%", "10%", "20%", "25%", "10%", "10%",]}

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
