import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { FilterPriceProfitWidget } from "./widgets/filters/filer-price-profit-widge";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widge";

const PriceProfitWidge = () => {
  const { classes } = useStyle();
  const { } = usePriceProfit()

  return (
    <div style={classes.mainContainer}>
      <PriceProfitHeaderWidget />
      <Divider style={classes.divider} />
      <FilterPriceProfitWidget />
    </div>
  );
};
export { PriceProfitWidge };
