import { CustomerAuthLayout } from "@/layouts";
import { MonitoringDashboardWidget } from "@/widgets/monitoring-dashboard-widget";
import { Permissions } from "@/components/CheckPermission/enum";
import {ProductionDashboardWidget} from "@/widgets/production-dashboard-widget/production-dashboard-widget";

export default function ProductionDashboardPage() {
  return (
    <CustomerAuthLayout
      staticPageTitle="Dashboard"
      permissionEnumValue={Permissions.SHOW_SALES_DASHBOARD}
      className={`custom-scrollbar`}
    >
      <ProductionDashboardWidget />
    </CustomerAuthLayout>
  );
}
