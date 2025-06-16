import { CustomerAuthLayout } from "@/layouts";
import { MonitoringDashboardWidget } from "@/widgets/monitoring-dashboard-widget";
import { Permissions } from "@/components/CheckPermission/enum";

export default function DashboardPage() {
  return (
    <CustomerAuthLayout
      staticPageTitle="Dashboard"
      permissionEnumValue={Permissions.SHOW_SALES_DASHBOARD}
      className={`custom-scrollbar`}
    >
      <MonitoringDashboardWidget />
    </CustomerAuthLayout>
  );
}
