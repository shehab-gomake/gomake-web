import { useEffect } from "react";
import { useGaussianChart } from "./use-gussian-chart";
import { Stack } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useStyle } from "./style";
import { GoMakeSelect } from "@/components/auto-complete/go-make-select";
import { PrimaryButton } from "@/components/button/primary-button";
import PriceCurveFit from "./components/price-curve-fit";

const GaussianChart = () => {
  const {
    t,
    isRTL,
    getProfitsChartData,
    chartData,
    productList,
    onChangeProductId,
    productId,
  } = useGaussianChart();
  const { classes } = useStyle();

  useEffect(() => {
    if (productId !== null) {
      getProfitsChartData(productId);
    } else getProfitsChartData();
  }, [productId]);

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
          <PrimaryButton variant={"outlined"} style={classes.fixBtn}>
            {t("Fix")}
          </PrimaryButton>
          <GoMakeSelect
            options={productList?.map((product) => ({
              value: product.id,
              label: product?.name,
            }))}
            style={classes.dropDownListStyle}
            placeholder={t("boardMissions.selectProducts")}
            onChange={onChangeProductId}
            value={productList?.find((p) => p.id === productId)?.name || null}
          />
        </Stack>
      </Stack>
      <PriceCurveFit {...chartData} />
    </Stack>
  );
};

export { GaussianChart };
