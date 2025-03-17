import { CustomerAuthLayout } from "@/layouts";
import { GaussianChart } from "@/pages-components/gussian-chart/gussian-chart";

export default function GaussianChartPage() {
  return (
    <CustomerAuthLayout
      className={`custom-scrollbar`}
      backgroundColor={"#f6f6f6"}
    >
      <GaussianChart />
    </CustomerAuthLayout>
  );
}
