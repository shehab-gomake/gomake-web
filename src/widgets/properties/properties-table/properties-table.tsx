import { useTranslation } from "react-i18next";

import { AddRuleModal } from "@/pages-components/products/profits-new/widgets/add-rule-modal";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useStyle } from "@/widgets/properties/properties-table/style";
import { PrimaryTable } from "@/components/tables/primary-table";

import { EditRulesModal } from "../properties-modals/edit-rule-modal";
import { useProperites } from "../hooks/use-properites";
import { MoreMenuWidget } from "../more-circle";

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
  } = useProperites({ classes });

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
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={propertiesDataSearched}
          headers={tableHeaders}
        />
      ) : (
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={propertiesData}
          headers={tableHeaders}
        />
      )}
      {/* <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={false}
        rows={propertiesData}
        headers={tableHeaders}
      /> */}
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
