import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
    },
  },
};

export function LineChart({ actionProfitRowChartData }) {
  const data = {
    labels: actionProfitRowChartData?.profitAxis,
    datasets: [
      {
        label: "Cost",
        data: actionProfitRowChartData?.costAxis,
        borderColor: "#FF4DCA",
        backgroundColor: "#FF4DCA",
      },
    ],
  };
  return (
    actionProfitRowChartData?.costAxis?.length > 0 && (
      <Line
        options={options}
        data={data}
        style={{
          width: 600,
          height: 300,
        }}
      />
    )
  );
}
