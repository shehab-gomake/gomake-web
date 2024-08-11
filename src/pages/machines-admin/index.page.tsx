import { CustomerAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/machines/components/categories-table/categories-table";
import { Permissions } from "@/components/CheckPermission/enum";

export default function CustomerMachinesPage() {
    return (
        <CustomerAuthLayout permissionEnumValue={Permissions.MACHINES_ADMIN} className={`custom-scrollbar`}>
            <CategoriesTable isAdmin={true} />
        </CustomerAuthLayout>
    );
}