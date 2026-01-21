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
import { LineChartProps } from "@/pages-components/products/profits-new/interface";
import { useTranslation } from "react-i18next";
import { ETransition } from "@/pages-components/products/profits-new/enums/profites-enum";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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

export function LineChart({ actionProfitRowChartData, selectedTransition }: LineChartProps) {
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();
  const data = {
    labels: actionProfitRowChartData?.profitAxis,
    datasets: [
      {
        label: actionProfitRowChartData?.label || t("products.profits.pricingListWidget.cost"),
        data: actionProfitRowChartData?.costAxis,
        borderColor: secondColor(400),
        backgroundColor: secondColor(400),
        stepped: selectedTransition?.value === ETransition.STEPS ? true : false,

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
