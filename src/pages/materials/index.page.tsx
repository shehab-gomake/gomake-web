import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/materials/categories-table";

export default function CustomerMaterialsPage() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_MATERIALS}>
      <CategoriesTable />
    </CustomerAuthLayout>
  );
}
