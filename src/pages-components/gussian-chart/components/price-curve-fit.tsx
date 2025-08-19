import { Scatter } from "react-chartjs-2"; // Use Scatter chart instead of Line chart
import {
  Chart as ChartJS,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(PointElement, CategoryScale, LinearScale, LineElement);

import { useTranslation } from "react-i18next";

const PriceCurveFit = ({
  calculatedPricesCosts,
  userPricesCosts,
  calculatedPrices,
  userPrices,
  pointsX,
  pointsY,
}) => {
  const { t } = useTranslation();

  const data = {
    datasets: [
      // First line: calculatedPricesCosts vs calculatedPrices
      {
        label: "Cost 1 vs Calculate Price",
        data: calculatedPricesCosts?.map((cost, index) => ({
          x: cost, // X is based on calculatedPricesCosts
          y: calculatedPrices[index], // Y is based on calculatedPrices
        })),
        borderColor: "rgba(75,192,192,1)", // Line color for calculatedPricesCosts vs calculatedPrices
        backgroundColor: "rgba(75,192,192,0.2)", // Transparency
        fill: false,
        borderWidth: 2,
        tension: 0, // Straight line
        showLine: true, // Show line
        pointRadius: 0, // Hide points
      },
      // Second line: userPricesCosts vs userPrices
      {
        label: "Cost 2 vs User Price",
        data: userPricesCosts.map((cost, index) => ({
          x: cost, // X is based on userPricesCosts
          y: userPrices[index], // Y is based on userPrices
        })),
        borderColor: "rgba(255,99,132,1)", // Line color for userPricesCosts vs userPrices
        backgroundColor: "rgba(255,99,132,0.2)", // Transparency
        fill: false,
        borderWidth: 2,
        tension: 0, // Straight line
        showLine: true, // Show line
        pointRadius: 0, // Hide points
      },
      // Scatter points: pointsX vs pointsY
      {
        label: "Fitted Regression Points",
        data: pointsX.map((x, index) => ({
          x, // X is based on pointsX
          y: pointsY[index], // Y is based on pointsY
        })),
        borderColor: "rgba(255,159,64,1)", // Color for scatter points
        backgroundColor: "rgba(255,159,64,0.4)", // Scatter point transparency
        fill: false,
        pointRadius: 5, // Size of the scatter points
        showLine: false, // No line for scatter points
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: t("pricingWidget.cost"), // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: t("sales.quote.price"), // Y-axis title
        },
        ticks: {
          // Format the tick values to show large numbers with commas
          callback: function (value) {
            return value.toLocaleString(); // Adds commas for readability
          },
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default PriceCurveFit;
