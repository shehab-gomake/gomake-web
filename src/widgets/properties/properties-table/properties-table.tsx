import { useTranslation } from "react-i18next";

import { AddRuleModal } from "@/pages-components/products/profits-new/widgets/add-rule-modal";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useStyle } from "@/widgets/properties/properties-table/style";
import { PrimaryTable } from "@/components/tables/primary-table";

import { EditRulesModal } from "../properties-modals/edit-rule-modal";
import { useProperites } from "../hooks/use-properites";
import { MoreMenuWidget } from "../more-circle";
import { PrimaryTableWithDragAndDrop } from "@/components/tables/primary-table-with-drag-and-drop";
import { useState } from "react";

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
    setProperitesData
  } = useProperites({ classes });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedRows = Array.from(propertiesData);
    const [removed] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, removed);
    console.log("reorderedRows", reorderedRows)

    setProperitesData(reorderedRows);
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
        />
      ) : (
        <PrimaryTableWithDragAndDrop
          stickyFirstCol={false}
          stickyHeader={false}
          rows={propertiesData}
          headers={tableHeaders}
          onDragEnd={onDragEnd}
        />
      )}

      <AddRuleModal
        openModal={openAddRule}
        onCloseModal={onCloseAddRuleModal}
        isPropertiesWidge={true}
        selectedProperties={selectedProperties}
        getProperitesService={getProperitesService}
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
      />
    </div>
  );
};

export { PropertiesTable };
