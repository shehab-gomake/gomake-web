import { GoMakeDatepicker } from "@/components/datepicker";
import { useStyle } from "./style";
import { useSalesDashboardFilters } from "./use-filters";
import { useEffect } from "react";
import { MultiSelectDropdown } from "@/components/multi-select/multi-select-drop-down";

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
    getAllProductTypes,
    allProductTypes,
    toggleAllProductTypes,
    toggleProductType,
    selectedProductTypesIds,
  } = useSalesDashboardFilters();

  useEffect(() => {
    getAllProductTypes();
  }, []);

  return (
    <div style={classes.container}>
      <div style={classes.datesContainer}>
        <GoMakeDatepicker />
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
    </div>
  );
};

export { DashboardFilters };
