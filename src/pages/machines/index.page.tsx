import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/machines/components/categories-table/categories-table";

export default function CustomerMachinesPage() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_MACHINES}>
      <CategoriesTable isAdmin={false} />
    </CustomerAuthLayout>
  );
}
