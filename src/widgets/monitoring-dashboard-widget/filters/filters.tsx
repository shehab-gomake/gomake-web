import { GoMakeDatepicker } from "@/components/datepicker";
import { useStyle } from "./style";
import { useSalesDashboardFilters } from "./use-filters";
import { MultiSelectDropdown } from "@/components/multi-select/multi-select-drop-down";
import { SingleSelectSearchDropdown } from "./components/single-customer-select-dropdown";
import { FixedDataType } from "./components/fixed-data-type-component";

const DashboardFilters = () => {
  const { classes } = useStyle();
  const {
    t,
    agentsCategories,
    productItems,
    toggleAllProducts,
    toggleProduct,
    toggleAllAgents,
    toggleAgent,
    selectedProductIds,
    selectedAgentIds,
    allProductTypes,
    toggleAllProductTypes,
    toggleProductType,
    selectedProductTypesIds,
    toggleAllClientTypes,
    toggleClientType,
    selectedClientTypesIds,
    clientTypesCategories,
    toggleAllJobTypes,
    toggleJobType,
    selectedJobTypesIds,
    jobTypesCategories,
  } = useSalesDashboardFilters();

  return (
    <div style={classes.datesContainer}>
      <GoMakeDatepicker />
      <FixedDataType />
      <SingleSelectSearchDropdown />
      <MultiSelectDropdown
        items={clientTypesCategories}
        selectedIds={selectedClientTypesIds}
        onToggle={toggleClientType}
        onToggleAll={toggleAllClientTypes}
        buttonLabel={t("customers.modal.clientType")}
      />
      <MultiSelectDropdown
        items={jobTypesCategories}
        selectedIds={selectedJobTypesIds}
        onToggle={toggleJobType}
        onToggleAll={toggleAllJobTypes}
        buttonLabel={t("dashboard.jobType")}
      />
      <MultiSelectDropdown
        items={agentsCategories}
        selectedIds={selectedAgentIds}
        onToggle={toggleAgent}
        onToggleAll={toggleAllAgents}
        buttonLabel={t("dashboard.agents")}
      />
      <MultiSelectDropdown
        items={productItems}
        selectedIds={selectedProductIds}
        onToggle={toggleProduct}
        onToggleAll={toggleAllProducts}
        buttonLabel={t("boardMissions.products")}
      />
      <MultiSelectDropdown
        items={allProductTypes}
        selectedIds={selectedProductTypesIds}
        onToggle={toggleProductType}
        onToggleAll={toggleAllProductTypes}
        buttonLabel={t("products.profits.exceptions.productType")}
      />
    </div>
  );
};

export { DashboardFilters };
