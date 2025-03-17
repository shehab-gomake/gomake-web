import { useEffect } from "react";
import { useGaussianChart } from "./use-gussian-chart";
import PriceCurveFit from "./components/price-curve-fit";

const GaussianChart = () => {
  const { getProfitsChartData, chartData } = useGaussianChart();

  useEffect(() => {
    getProfitsChartData();
  }, []);

  return <PriceCurveFit {...chartData} />;
};

export { GaussianChart };
