import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PieChartIcon from "@mui/icons-material/PieChart";
import { useStyle } from "./style";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface ChartItem {
  label: string;
  value: number;
}

interface PieChartComponentProps {
  chartData: ChartItem[];
  chartTitle?: string;
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
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
        data: values,
        backgroundColor: backgroundColors.slice(0, labels?.length),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: chartData?.length > 1, // Hide legend if only one item
        position: "right" as const,
        labels: {
          boxWidth: 20,
          font: {
            size: 14,
            family: "Arial",
          },
          color: "#4B4B4B",
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
            <PieChartIcon style={{ color: "var(--theme-primary-color, #2E3092)" }} />
          </div>
          <div
            style={{
              borderBottom: "1px solid #d0d5dd",
              marginBottom: 12,
            }}
          />
        </>
      )}
      <div style={{ height: 200, position: "relative" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
