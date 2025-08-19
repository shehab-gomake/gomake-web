import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widge";
import { GaussianChart } from "@/pages-components/gussian-chart/gussian-chart";
import { useEffect } from "react";
import PriceCurveFit from "@/pages-components/gussian-chart/components/price-curve-fit";

const PriceProfitWidge = () => {
  const { classes } = useStyle();
  const {
    handlePrintClose,
    anchorElPrint,
    openPrint,
    handleOpenPrint,
    onClickPrint,
    getProfitsChartData,
    chartData,
    productId,
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
  } = usePriceProfit();

  // useEffect(() => {
  //   if (productId !== null) {
  //     getProfitsChartData(productId);
  //   } else getProfitsChartData();
  // }, [productId]);

  useEffect(() => {
    if (productId || fromDate || toDate || action) {
      const fromDataString = fromDate ? fromDate.toISOString() : undefined;
      const toDataString = toDate ? toDate.toISOString() : undefined;

      getDataForAutoPricingActionsChart(
        productId || undefined,
        fromDataString,
        toDataString,
        action?.actionId ?? undefined
      );
    }
  }, [productId, fromDate, toDate, action?.actionId]);

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
      {/* <PriceCurveFit {...chartData} /> */}
    </div>
  );
};
export { PriceProfitWidge };
