import { CustomerAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/materials/categories-table";

export default function CustomerMachinesPage() {
  return (
    <div>
      <CustomerAuthLayout>
        <h1>Materials</h1>
        <CategoriesTable />
      </CustomerAuthLayout>
    </div>
  );
}
