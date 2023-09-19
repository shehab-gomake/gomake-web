import { CustomerAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/materials/categories-table";

export default function CustomerMaterialsPage() {
  return (
    <CustomerAuthLayout>
      <CategoriesTable />
    </CustomerAuthLayout>
  );
}
