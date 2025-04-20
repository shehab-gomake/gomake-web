import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useTranslation } from "react-i18next";

import type { ChartOptions } from "chart.js";

// Register necessary components
ChartJS.register(
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  TimeScale,
  Tooltip,
  Legend
);

interface SalesItem {
  date: string;
  [key: string]: number | string;
}

interface PriceCurveFitProps {
  salesItems: SalesItem[];
  xKey?: string; // default to 'date'
  yKeys: string[]; // keys to plot on y-axis
}

const COLORS = [
  "rgba(75,192,192,1)",
  "rgba(255,99,132,1)",
  "rgba(255,159,64,1)",
  "rgba(54,162,235,1)",
  "rgba(153,102,255,1)",
  "rgba(255,206,86,1)",
];

const DashboardChart = ({
  salesItems,
  xKey = "date",
  yKeys = [],
}: PriceCurveFitProps) => {
  const { t } = useTranslation();

  const datasets = yKeys.map((key, index) => ({
    label: t(`sales.chart.${key}`) || key,
    data: salesItems.map((item) => ({
      x: item[xKey],
      y: item[key],
    })),
    borderColor: COLORS[index % COLORS.length],
    backgroundColor: COLORS[index % COLORS.length],
    fill: false,
    borderWidth: 2,
    tension: 0,
    showLine: true,
    pointRadius: 3,
  }));

  const data = { datasets };

  const options: ChartOptions<"scatter"> = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        title: {
          display: true,
          text: t("general.date"),
        },
        time: {
          unit: "day",
          tooltipFormat: "PPP",
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: t("sales.chart.value"),
        },
        ticks: {
          callback: (value: number) => value.toLocaleString(),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${
              context.dataset.label
            }: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default DashboardChart;
