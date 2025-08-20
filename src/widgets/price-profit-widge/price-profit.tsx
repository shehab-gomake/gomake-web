import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widget";
import { SummaryWidget } from "./widgets/summary/summary-widget";
import { useEffect } from "react";
import PriceCurveFit from "./widgets/chart/price-curve-fit";

const PriceProfitWidget = () => {
  const { classes } = useStyle();
  const {
    actionList,
    onChangeActionId,
    action,
    onSelectDeliveryTimeDates,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    getDataForAutoPricingActionsChart,
    handleAutoFix,
    handleRollback,
    isFixed,
    summaryData,
    getActions,
    getProfitsPricingTables,
    profitsPricingTables,
    selectedPricingTable,
    onSelectPricingTable,
    chartData,
    exportDataForProfitsByAction,
  } = usePriceProfit();

  useEffect(() => {
    if (fromDate || toDate || action || selectedPricingTable) {
      const fromDataString = fromDate ? fromDate.toISOString() : undefined;
      const toDataString = toDate ? toDate.toISOString() : undefined;

      getDataForAutoPricingActionsChart(
        fromDataString,
        toDataString,
        action?.actionId ?? undefined,
        selectedPricingTable?.value ?? undefined
      );
    }
  }, [fromDate, toDate, action?.actionId, selectedPricingTable?.value]);

  useEffect(() => {
    getActions();
  }, []);

  useEffect(() => {
    if (action?.actionId) {
      getProfitsPricingTables();
    }
  }, [action?.actionId, getProfitsPricingTables]);

  return (
    <div style={classes.mainContainer}>
      <PriceProfitHeaderWidget
        onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        actionList={actionList}
        action={action}
        onChangeActionId={onChangeActionId}
        profitsPricingTables={profitsPricingTables}
        selectedPricingTable={selectedPricingTable}
        onSelectPricingTable={onSelectPricingTable}
        handleAutoFix={handleAutoFix}
        handleRollback={handleRollback}
        isFixed={isFixed}
        onClickDownloadExcel={exportDataForProfitsByAction}
      />
      <Divider style={classes.divider} />
      <SummaryWidget summaryData={summaryData} isFixed={isFixed} />
      <PriceCurveFit {...chartData} />
    </div>
  );
};
export { PriceProfitWidget };
