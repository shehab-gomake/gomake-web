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
import { useTranslation } from "react-i18next";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ChartsCostsComponent = ({ selectedWorkFlow }) => {
  const { t } = useTranslation();

  // Get values with null/undefined safety
  const laborCosts = selectedWorkFlow?.totalLaborCosts || 0;
  const materialCosts = selectedWorkFlow?.totalMaterialCosts || 0;
  const otherCosts = selectedWorkFlow?.totalOtherCosts || 0;

  // Check if all values are 0 or null
  const hasNoData = laborCosts === 0 && materialCosts === 0 && otherCosts === 0;

  // If all data is 0 or null, don't render the chart
  if (hasNoData) {
    return null;
  }

  const total = laborCosts + materialCosts + otherCosts;
  const currency = selectedWorkFlow?.totalCost?.defaultUnit || '';

  // Build datasets array conditionally
  const datasets = [];

  if (laborCosts > 0) {
    datasets.push({
      label: `${t("pricingWidget.labor")} (${currency})`,
      data: [laborCosts],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      stack: 'Stack 0',
    });
  }

  if (materialCosts > 0) {
    datasets.push({
      label: `${t("pricingWidget.material")} (${currency})`,
      data: [materialCosts],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      stack: 'Stack 0',
    });
  }

  if (otherCosts > 0) {
    datasets.push({
      label: `${t("pricingWidget.technical")} (${currency})`,
      data: [otherCosts],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      stack: 'Stack 0',
    });
  }

  return (
    <Bar
      data={{
        labels: [''],
        datasets: datasets
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
              color: "#000",
              font: {
                size: 11,
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