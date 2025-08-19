import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widge";
import { useEffect } from "react";
import PriceCurveFit from "./widgets/chart/price-curve-fit";

const PriceProfitWidge = () => {
  const { classes } = useStyle();
  const {
    handlePrintClose,
    anchorElPrint,
    openPrint,
    handleOpenPrint,
    onClickPrint,
    actionList,
    onChangeActionId,
    action,
    onSelectDeliveryTimeDates,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    getDataForAutoPricingActionsChart,
    getActions,
    chartData,
  } = usePriceProfit();

  useEffect(() => {
    if (fromDate || toDate || action) {
      const fromDataString = fromDate ? fromDate.toISOString() : undefined;
      const toDataString = toDate ? toDate.toISOString() : undefined;

      getDataForAutoPricingActionsChart(
        fromDataString,
        toDataString,
        action?.actionId ?? undefined
      );
    }
  }, [fromDate, toDate, action?.actionId]);

  useEffect(() => {
    getActions();
  }, []);

  return (
    <div style={classes.mainContainer}>
      <PriceProfitHeaderWidget
        handlePrintClose={handlePrintClose}
        anchorElPrint={anchorElPrint}
        openPrint={openPrint}
        handleOpenPrint={handleOpenPrint}
        onClickPrint={onClickPrint}
        onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        actionList={actionList}
        action={action}
        onChangeActionId={onChangeActionId}
      />
      <Divider style={classes.divider} />
      <PriceCurveFit {...chartData} />
    </div>
  );
};
export { PriceProfitWidge };
