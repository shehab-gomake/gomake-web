import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  Legend
);

import { useTranslation } from "react-i18next";

const PriceCurveFit = ({
  calculatedProfitsCosts = [],
  userProfitsCosts = [],
  fixedProfitsCosts = [],
  calculatedProfits = [],
  userProfits = [],
  fixedProfits = [],
  costLineX = [],
  costLineY = [],
  pointsX = [],
  pointsY = [],
  abnormalPointsX = [],
  abnormalPointsY = [],
  isSummaryVisible = false,
}) => {
  const { t } = useTranslation();

  // Check if at least one fixed price is not zero
  const hasNonZerofixedProfits = fixedProfits.some(
    (price) => Number(price) !== 0
  );

  const datasets = [
    // 1) Cost vs Calculated Price
    {
      label: t("priceProfit.calculatedProfit"),
      data: calculatedProfitsCosts.map((x, i) => ({
        x,
        y: calculatedProfits[i],
      })),
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
      fill: false,
      borderWidth: 2,
      tension: 0,
      showLine: true,
      pointRadius: 0,
    },
    // 2) Cost vs User Price
    {
      label: t("priceProfit.userProfit"),
      data: userProfitsCosts.map((x, i) => ({ x, y: userProfits[i] })),
      borderColor: "rgba(255,99,132,1)",
      backgroundColor: "rgba(255,99,132,0.2)",
      fill: false,
      borderWidth: 2,
      tension: 0,
      showLine: true,
      pointRadius: 0,
    },
    // 3) Cost vs Fixed Price (only show if at least one value is not zero)
    ...(hasNonZerofixedProfits
      ? [
          {
            label: t("priceProfit.fixedProfit"),
            data: fixedProfitsCosts.map((x, i) => ({ x, y: fixedProfits[i] })),
            borderColor: "rgba(54,162,235,1)",
            backgroundColor: "rgba(54,162,235,0.2)",
            fill: false,
            borderWidth: 2,
            tension: 0,
            showLine: true,
            pointRadius: 0,
          },
        ]
      : []),

    ...(pointsX.length
      ? [
          {
            label: t("Fitted Points"),
            data: pointsX.map((x, i) => ({ x, y: pointsY[i] })),
            borderColor: "rgba(255,159,64,1)",
            backgroundColor: "rgba(255,159,64,0.4)",
            fill: false,
            pointRadius: 4,
            showLine: false,
          },
        ]
      : []),
    // abnormal action chart data as scatter points
    ...(abnormalPointsX.length
      ? [
          {
            label: t("priceProfit.abnormalPoints"),
            data: abnormalPointsX.map((x, i) => ({ x, y: abnormalPointsY[i] })),
            borderColor: "rgba(255,0,0,1)",
            backgroundColor: "rgba(255,0,0,0.6)",
            fill: false,
            pointRadius: 6,
            showLine: false,
          },
        ]
      : []),
  ];

  const data = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        title: { display: true, text: t("pricingWidget.cost") },
      },
      y: {
        title: {
          display: true,
          text: t("products.profits.pricingListWidget.profit"),
        },
        ticks: {
          callback: (value) => Number(value).toLocaleString(),
        },
      },
    },
  };

  // Dynamic height based on summary card visibility
  const chartHeight = isSummaryVisible ? "57vh" : "70vh";

  return (
    <div style={{ width: "100%", height: chartHeight, position: "relative" }}>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default PriceCurveFit;
