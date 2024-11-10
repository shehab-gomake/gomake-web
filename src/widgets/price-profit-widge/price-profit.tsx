import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { FilterPriceProfitWidget } from "./widgets/filters/filer-price-profit-widge";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widge";
import { PriceProfitTable } from "./widgets/table/able-price-profit-widge";

const PriceProfitWidge = () => {
  const { classes } = useStyle();
  const { data } = usePriceProfit()

  return (
    <div style={classes.mainContainer}>
      <PriceProfitHeaderWidget />
      <Divider style={classes.divider} />
      <FilterPriceProfitWidget />
      <PriceProfitTable headers={data?.headers} data={data?.data} />
    </div>
  );
};
export { PriceProfitWidge };
