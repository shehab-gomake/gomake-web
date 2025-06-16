import { CustomerAuthLayout } from "@/layouts";
import { MaterialsTableComponent } from "@/widgets/materials-widget/components/materials-table/materials-table";
import { Permissions } from "@/components/CheckPermission/enum";

export default function MaterialsTablePage() {
    return (
        <CustomerAuthLayout staticPageTitle={"materials"} permissionEnumValue={Permissions.SHOW_MATERIALS} className={`custom-scrollbar`}>
            <MaterialsTableComponent isAdmin={false} />
        </CustomerAuthLayout>
    )
}