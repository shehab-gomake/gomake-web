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
    handleOpenChartModal,
    getProfitsChartData,
    chartData,
    productList,
    onChangeProductId,
    productId,
    actionId,
    setActionId,
    onSelectDeliveryTimeDates,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  } = usePriceProfit();

  useEffect(() => {
    if (productId !== null) {
      getProfitsChartData(productId);
    } else getProfitsChartData();
  }, [productId]);

  return (
    <div style={classes.mainContainer}>
      <PriceProfitHeaderWidget
        handlePrintClose={handlePrintClose}
        anchorElPrint={anchorElPrint}
        openPrint={openPrint}
        handleOpenPrint={handleOpenPrint}
        onClickPrint={onClickPrint}
        handleOpenChartModal={handleOpenChartModal}
        //!here new
        productList={productList}
        productId={productId}
        onChangeProductId={onChangeProductId}
        actionId={actionId}
        setActionId={setActionId}
        onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />
      <Divider style={classes.divider} />
      <PriceCurveFit {...chartData} />
    </div>
  );
};
export { PriceProfitWidge };
