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

const ScatterWithRegression = ({
  systemPrices,
  workerPrices,
  fittedX,
  fittedY,
}) => {
  const data = {
    datasets: [
      {
        label: "System Prices vs Worker Prices",
        data: systemPrices.map((price, index) => ({
          x: price, // X is based on systemPrices
          y: workerPrices[index], // Y is based on workerPrices
        })),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: false,
        pointRadius: 5, // Size of the scatter points
        showLine: false, // No line between points
      },
      {
        label: "Fitted Regression Line",
        data: fittedX.map((x, index) => ({
          x, // X is based on fittedX
          y: fittedY[index], // Y is based on fittedY
        })),
        borderColor: "rgba(255,99,132,1)", // Line color
        backgroundColor: "rgba(255,99,132,0.2)", // Line color (with transparency)
        fill: false,
        borderWidth: 2, // Line thickness
        tension: 0, // Straight line, no smoothing
        showLine: true, // Show the regression line
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "System Prices", // X-axis title
        },
        min: 0, // Start the X-axis from 0
        max: 5000, // Set the maximum value for the X-axis
        ticks: {
          stepSize: 1000, // Step size for X-axis (values like 0, 100, 200, 300)
        },
      },
      y: {
        title: {
          display: true,
          text: "Worker Prices", // Y-axis title
        },
        min: 0, // Start the X-axis from 0
        max: 5000, // Set the maximum value for the Y-axis
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

export default ScatterWithRegression;
