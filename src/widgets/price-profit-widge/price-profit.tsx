import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { usePriceProfit } from "./use-price-profit";
import { PriceProfitHeaderWidget } from "./widgets/header/header-price-profit-widget";
import { SummaryWidget } from "./widgets/summary/summary-widget";
import { useEffect } from "react";
import PriceCurveFit from "./widgets/chart/price-curve-fit";
import { TotalCardComponent } from "@/pages-components/quotes/widgets/statistics-section/total-card";
import { useTranslation } from "react-i18next";

const PriceProfitWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  // Currency formatting utilities
  const numberFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatNumber = (value: number) => numberFormatter.format(value);

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
      <div style={classes.headerSection}>
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
          summaryData={summaryData}
        />
        <Divider style={classes.divider} />
      </div>
      <div style={classes.contentSection}>
        {/* Totals Section */}

        {isFixed && summaryData && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TotalCardComponent
              text={t("priceProfit.totalUserInputPrice")}
              number={formatNumber(summaryData.totalUserInputPrice)}
              withCurrency={true}
            />
            <TotalCardComponent
              text={t("priceProfit.totalCalculatedPrice")}
              number={formatNumber(summaryData.totalCalculatedPrice)}
              withCurrency={true}
            />
            <TotalCardComponent
              text={t("priceProfit.totalFixedPrice")}
              number={formatNumber(summaryData.totalFixedPrice)}
              withCurrency={true}
            />
          </div>
        )}
        <SummaryWidget summaryData={summaryData} isFixed={isFixed} />

        <PriceCurveFit
          {...chartData}
          isSummaryVisible={isFixed && !!summaryData}
        />
      </div>
    </div>
  );
};
export { PriceProfitWidget };
