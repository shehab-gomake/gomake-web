import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "@/components/CheckPermission/enum";
import TimelinePage from "@/pages/production-floor/gant/gantt-component";

export default function ProductionFloorPage() {
    return (
        <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_PRODUCTION_FLOOR} className={`custom-scrollbar`}>
            <TimelinePage/>
        </CustomerAuthLayout>
    );
}