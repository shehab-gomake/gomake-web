import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/machines/components/categories-table/categories-table";

export default function CustomerMachinesPage() {
  return (
    <CustomerAuthLayout staticPageTitle={"machines"} permissionEnumValue={Permissions.SHOW_MACHINES} className={`custom-scrollbar`}>
      <CategoriesTable isAdmin={false} />
    </CustomerAuthLayout>
  );
}
