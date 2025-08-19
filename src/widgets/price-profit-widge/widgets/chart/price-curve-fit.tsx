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
  calculatedPricesCosts = [],
  userPricesCosts = [],
  fixedPricesCosts = [],
  calculatedPrices = [],
  userPrices = [],
  fixedPrices = [],
  costLineX = [],
  costLineY = [],
  pointsX = [],
  pointsY = [],
}) => {
  const { t } = useTranslation();

  const datasets = [
    // 1) Cost vs Calculated Price
    {
      label: t("Calculated Price"),
      data: calculatedPricesCosts.map((x, i) => ({
        x,
        y: calculatedPrices[i],
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
      label: t("User Price"),
      data: userPricesCosts.map((x, i) => ({ x, y: userPrices[i] })),
      borderColor: "rgba(255,99,132,1)",
      backgroundColor: "rgba(255,99,132,0.2)",
      fill: false,
      borderWidth: 2,
      tension: 0,
      showLine: true,
      pointRadius: 0,
    },
    // 3) Cost vs Fixed Price
    {
      label: t("Fixed Price"),
      data: fixedPricesCosts.map((x, i) => ({ x, y: fixedPrices[i] })),
      borderColor: "rgba(54,162,235,1)",
      backgroundColor: "rgba(54,162,235,0.2)",
      fill: false,
      borderWidth: 2,
      tension: 0,
      showLine: true,
      pointRadius: 0,
    },
    // 4) Cost vs Cost (diagonal helper) — optional
    {
      label: t("Cost"),
      data: costLineX.map((x, i) => ({ x, y: costLineY[i] })),
      borderColor: "rgba(153,102,255,1)",
      backgroundColor: "rgba(153,102,255,0.2)",
      fill: false,
      borderWidth: 1,
      tension: 0,
      showLine: true,
      pointRadius: 0,
    },
    // scatter points (if you add regression later)
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
  ];

  const data = { datasets };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: t("pricingWidget.cost") },
      },
      y: {
        title: { display: true, text: t("sales.quote.price") },
        ticks: {
          callback: (value) => Number(value).toLocaleString(),
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default PriceCurveFit;
