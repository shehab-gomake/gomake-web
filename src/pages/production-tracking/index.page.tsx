import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "../../components/CheckPermission/enum";
import { DashboardWidget } from "@/widgets/dashboard-widget";

export default function ProductionDashBordPage() {
    return (
        <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_PRODUCTION_FLOOR}>
            <div style={{ padding: 15 }}>
                <DashboardWidget />
            </div>
        </CustomerAuthLayout>
    );
}