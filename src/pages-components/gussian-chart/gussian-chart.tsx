import { useEffect } from "react";
import { useGaussianChart } from "./use-gussian-chart";
import PriceCurveFit from "./components/price-curve-fit";
import { Box, Skeleton } from "@mui/material";

const GaussianChart = () => {
  const { getProfitsChartData, chartData } = useGaussianChart();

  useEffect(() => {
    getProfitsChartData();
  }, []);

  // const isLoading = !chartData?.pointsX.length && !chartData?.pointsY.length;

  // if (isLoading) {
  //   return (
  //     <Box
  //       sx={{
  //         width: "100%",
  //         height: 300,
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Skeleton variant="rectangular" width="100%" height={300} />
  //     </Box>
  //   );
  // }

  return <PriceCurveFit {...chartData} />;
};

export { GaussianChart };
