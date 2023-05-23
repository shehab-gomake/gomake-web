import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { chartDataByActionProfitRow } from "@/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as TooltipChart,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
const ChartVidget = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { secondColor } = useGomakeTheme();
  const chartDataValue = useRecoilValue<any>(chartDataByActionProfitRow);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    TooltipChart,
    Legend
  );
  const data = {
    labels: chartDataValue?.xAxis,
    datasets: [
      {
        label: "Quantity",
        data: chartDataValue?.yAxis,
        borderColor: secondColor(500),
        backgroundColor: secondColor(500),
      },
    ],
  };
  const options: any = {
    scales: {
      y: {
        title: {
          display: true,
          text: "Quantity",
        },
      },
      x: {
        title: {
          display: true,
          text: "Profits",
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
    },
  };

  return (
    <div style={clasess.mainCointainer}>
      <Line id="calculated-engagements-count" options={options} data={data} />
    </div>
  );
};
export { ChartVidget };
