import { GoMakeDatepicker } from "@/components/datepicker";
import { useStyle } from "./style";
import { useSalesDashboardFilters } from "./use-filters";
import { MultiSelectDropdown } from "@/components/multi-select/multi-select-drop-down";
import { SingleSelectSearchDropdown } from "./single-customer-select-dropdown";

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
  } = useSalesDashboardFilters();

  return (
    <div style={classes.datesContainer}>
      <GoMakeDatepicker />
      <SingleSelectSearchDropdown />
      <MultiSelectDropdown
        items={clientTypesCategories}
        selectedIds={selectedClientTypesIds}
        onToggle={toggleClientType}
        onToggleAll={toggleAllClientTypes}
        buttonLabel={t("customers.modal.clientType")}
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
