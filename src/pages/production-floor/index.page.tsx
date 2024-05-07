import { CustomerAuthLayout } from "@/layouts";
import { ProductionFloorWidget } from "@/widgets/production-floor/production-floor-widget";
import { Permissions } from "../../components/CheckPermission/enum";
import { DashboardWidget } from "@/widgets/dashboard-widget";

export default function ProductionFloorPage() {
    return (
        <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_PRODUCTION_FLOOR}>
            {/* <ProductionFloorWidget/> */}
            <DashboardWidget />

        </CustomerAuthLayout>
    );
}