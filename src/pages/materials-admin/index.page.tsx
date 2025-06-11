import { CustomerAuthLayout } from "@/layouts";
import { MaterialsTableComponent } from "@/widgets/materials-widget/components/materials-table/materials-table";
import { Permissions } from "@/components/CheckPermission/enum";

export default function MaterialsTablePage() {
    return (
        <CustomerAuthLayout staticPageTitle={"materials admin"} permissionEnumValue={Permissions.MATERIALS_ADMIN} className={`custom-scrollbar`}>
            <MaterialsTableComponent isAdmin={true} />
        </CustomerAuthLayout>
    )
}