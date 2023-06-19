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
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chartDataByActionProfitRow } from "@/store";

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
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
    },
  },
};

export function LineChart() {
  const chartDataValue = useRecoilValue<any>(chartDataByActionProfitRow);
  const data = {
    labels: chartDataValue?.profitAxis,
    datasets: [
      {
        label: "Cost",
        data: chartDataValue?.costAxis,
        borderColor: "#FF4DCA",
        backgroundColor: "#FF4DCA",
      },
      // {
      //   label: "Quantity",
      //   data: chartDataValue?.quantityAxis,
      //   borderColor: "#62A0FF",
      //   backgroundColor: "#62A0FF",
      // },
    ],
  };
  return (
    chartDataValue?.costAxis?.length > 0 && (
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
