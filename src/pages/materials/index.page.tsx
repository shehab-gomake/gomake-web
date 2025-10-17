import { CustomerAuthLayout } from "@/layouts";
import { CustomMaterialsGrouped } from "@/widgets/materials-widget/components/materials-grouped";
import { Permissions } from "@/components/CheckPermission/enum";

export default function MaterialsTablePage() {
    return (
        <CustomerAuthLayout staticPageTitle={"materials"} permissionEnumValue={Permissions.SHOW_MATERIALS} className={`custom-scrollbar`}>
            <CustomMaterialsGrouped isAdmin={false} />
        </CustomerAuthLayout>
    )
}