import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useStyle } from "./style";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface ChartItem {
  label: string;
  value: number;
}

interface BarChartComponentProps {
  chartData: ChartItem[];
  chartTitle?: string;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  chartData,
  chartTitle = "",
}) => {
  const { classes } = useStyle();
  const labels = chartData?.map((item) => item.label);
  const values = chartData?.map((item) => item.value);

  const backgroundColors = [
    "#2CB5A0",
    "#4A90E2",
    "#F2994A",
    "#9B51E0",
    "#EB5757",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: chartTitle,
        data: values,
        backgroundColor: backgroundColors.slice(0, labels?.length),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#4B4B4B",
          font: {
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          color: "#4B4B4B",
          font: {
            size: 12,
          },
        },
      },
    },
    layout: {
      padding: 10,
    },
  };

  return (
    <div style={classes.pieContainer}>
      {chartTitle && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <h3
              style={{
                color: "#333",
                fontWeight: 600,
              }}
            >
              {chartTitle}
            </h3>
            <BarChartIcon style={{ color: "var(--theme-primary-color, #2E3092)" }} />
          </div>
          <div
            style={{
              borderBottom: "1px solid #d0d5dd",
              marginBottom: 12,
            }}
          />
        </>
      )}
      <div style={{ height: 250, position: "relative" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
