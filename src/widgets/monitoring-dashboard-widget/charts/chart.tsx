import { Stack } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useStyle } from "./style";
import { GoMakeDatepicker } from "@/components/datepicker";
import { useTranslation } from "react-i18next";
import PriceCurveFit from "@/pages-components/gussian-chart/components/price-curve-fit";

const DashboardChart = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";

  const salesData = {
    salesItems: [
      { totalCost: 233.16, totalPrice: 5459.08, avgTotalPrice: 6823.85 },
      { totalCost: 233.16, totalPrice: 5459.08, avgTotalPrice: 6823.85 },
      { totalCost: 235.51, totalPrice: 50, avgTotalPrice: 526.33 },
      { totalCost: 211.45, totalPrice: 487.72, avgTotalPrice: 487.72 },
      { totalCost: 335.63, totalPrice: 727.15, avgTotalPrice: 727.15 },
      { totalCost: 243, totalPrice: 556.34, avgTotalPrice: 556.34 },
      { totalCost: 233.13, totalPrice: 520.22, avgTotalPrice: 520.22 },
      { totalCost: 233.16, totalPrice: 5459.08, avgTotalPrice: 6823.85 },
      { totalCost: 151.42, totalPrice: 381.13, avgTotalPrice: 381.13 },
      { totalCost: 0, totalPrice: 186.3, avgTotalPrice: 0 },
      { totalCost: 235.51, totalPrice: 526.33, avgTotalPrice: 526.33 },
      { totalCost: 197.02, totalPrice: 462.86, avgTotalPrice: 462.86 },
      { totalCost: 112.99, totalPrice: 285.19, avgTotalPrice: 285.19 },
      { totalCost: 128.7, totalPrice: 321.54, avgTotalPrice: 321.54 },
      { totalCost: 597.25, totalPrice: 1215.25, avgTotalPrice: 1215.25 },
    ],
    totalPrice: 22097.27,
    totalCost: 3381.09,
    totalProfit: 18716.18,
  };

  const chartData = {
    calculatedPricesCosts: salesData.salesItems.map((item) => item.totalCost),
    userPricesCosts: salesData.salesItems.map((item) => item.totalCost), // Adjust if user price cost differs
    calculatedPrices: salesData.salesItems.map((item) => item.avgTotalPrice),
    userPrices: salesData.salesItems.map((item) => item.totalPrice),
    pointsX: salesData.salesItems.map((item) => item.totalCost),
    pointsY: salesData.salesItems.map((item) => item.totalPrice),
  };

  return (
    <Stack>
      <Stack
        direction={"row"}
        padding={isRTL ? "0px 60px 0px 20px" : "0px 20px 0px 60px"}
        width={"100%"}
        justifyContent={"space-between"}
      >
        <div style={classes.infoDiv}>
          <span style={{ fontSize: "14px" }}>
            <CircleIcon style={{ color: "rgba(75,192,192,1)", fontSize: 14 }} />{" "}
            Calculate Price
          </span>
          <span style={{ fontSize: "14px" }}>
            <CircleIcon style={{ color: "rgba(255,99,132,1)", fontSize: 14 }} />{" "}
            User Price
          </span>
        </div>
        <Stack direction={"row"} alignItems={"center"} gap={"5px"}>
          <GoMakeDatepicker />
        </Stack>
      </Stack>
      <PriceCurveFit {...chartData} />
    </Stack>
  );
};

export { DashboardChart };
