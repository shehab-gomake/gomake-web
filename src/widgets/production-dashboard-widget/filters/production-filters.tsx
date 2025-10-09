import { GoMakeDatepicker } from "@/components/datepicker";
import { useStyle } from "../style";

interface ProductionDashboardFiltersProps {}

const ProductionDashboardFilters = () => {
  const { classes } = useStyle();

  return (
    <div style={classes.subContainer}>
      <GoMakeDatepicker />
    </div>
  );
};

export { ProductionDashboardFilters };
