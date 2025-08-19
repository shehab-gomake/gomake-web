import { CustomerAuthLayout } from "@/layouts";
import { AdminCategoriesTable } from "@/widgets/machines/admin/admin-categories-table";
import { Permissions } from "@/components/CheckPermission/enum";

export default function CustomerMachinesPage() {
    return (
        <CustomerAuthLayout staticPageTitle={"machines admin"} permissionEnumValue={Permissions.MACHINES_ADMIN} className={`custom-scrollbar`}>
            <AdminCategoriesTable />
        </CustomerAuthLayout>
    );
}