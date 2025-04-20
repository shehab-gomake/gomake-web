import { CustomerAuthLayout } from "@/layouts";
import { MonitoringDashboardWidget } from "@/widgets/monitoring-dashboard-widget";

export default function DashboardPage() {
  return (
    <CustomerAuthLayout className={`custom-scrollbar`}>
      <MonitoringDashboardWidget />
    </CustomerAuthLayout>
  );
}
