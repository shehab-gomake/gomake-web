import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widge";
import { useEffect } from "react";
import PriceCurveFit from "./widgets/chart/price-curve-fit";

const PriceProfitWidget = () => {
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
    handleAutoFix,
    handleRollback,
    isFixed,
    getActions,
    getProfitsPricingTables,
    profitsPricingTables,
    selectedPricingTable,
    onSelectPricingTable,
    chartData,
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
        profitsPricingTables={profitsPricingTables}
        selectedPricingTable={selectedPricingTable}
        onSelectPricingTable={onSelectPricingTable}
        handleAutoFix={handleAutoFix}
        handleRollback={handleRollback}
        isFixed={isFixed}
      />
      <Divider style={classes.divider} />
      <PriceCurveFit {...chartData} />
    </div>
  );
};
export { PriceProfitWidget };
