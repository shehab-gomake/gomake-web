import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);
const ChartsCostsComponent = ({ selectedWorkFlow }) => {

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 200, height: 200 }}>
      <Doughnut
        data={{
          labels: ['Labor', 'Material', 'Other'],
          datasets: [
            {
              label: 'Costs',
              data: [
                selectedWorkFlow.totalLaborCosts,
                selectedWorkFlow.totalMaterialCosts,
                selectedWorkFlow.totalOtherCosts
              ],
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(75, 192, 192, 0.6)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Cost Breakdown'
            }
          }
        }}
      />
    </div>
  );
};
export { ChartsCostsComponent };
