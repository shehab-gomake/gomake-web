import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
const ChartsCostsComponent = ({ selectedWorkFlow }) => {
  console.log(selectedWorkFlow);
  const total = selectedWorkFlow.totalLaborCosts + selectedWorkFlow.totalMaterialCosts + selectedWorkFlow.totalOtherCosts;
  const currency = selectedWorkFlow?.totalCost?.defaultUnit;

  return (
    <Bar
      data={{
        labels: [''],
        datasets: [
          {
            label: `Labor (${currency})`,
            data: [selectedWorkFlow.totalLaborCosts],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            stack: 'Stack 0',
          },
          {
            label: `Material (${currency})`,
            data: [selectedWorkFlow.totalMaterialCosts],
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            stack: 'Stack 0',
          },
          {
            label: `Technical (${currency})`,
            data: [selectedWorkFlow.totalOtherCosts],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            stack: 'Stack 0',
          }
        ]
      }}
      options={{
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: true,
            align: 'center',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              font: {
                size: 10,
              }

            }
          },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            stacked: true,
            display: false,
            max: total,
          },
          y: {
            stacked: true,
            display: false,
          }
        },
        elements: {
          bar: {
            borderRadius: 0,
          }
        }
      }}
      style={{
        height: 65,
        minHeight: 65,
        maxHeight: 65,
        minWidth: 305,
      }}
    />
  );
};
export { ChartsCostsComponent };
