import { CustomerAuthLayout } from "@/layouts";
import { CustomMaterialsGrouped } from "@/widgets/materials-widget/components/materials-grouped";
import { Permissions } from "@/components/CheckPermission/enum";

export default function MaterialsTablePage() {
    return (
        <CustomerAuthLayout staticPageTitle={"materials admin"} permissionEnumValue={Permissions.MATERIALS_ADMIN} className={`custom-scrollbar`}>
            <CustomMaterialsGrouped isAdmin={true} />
        </CustomerAuthLayout>
    )
}