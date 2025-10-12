import { ProductionDashboardFilters } from "./filters/production-filters";
import { MainProductionReportTable } from "./production-dashboard-table";
import { useStyle } from "./style";

const ProductionDashboardWidget = () => {
  const { classes } = useStyle();

  return (
    <div style={classes.container}>
      <ProductionDashboardFilters />
      <MainProductionReportTable />
    </div>
  );
};
export { ProductionDashboardWidget };
