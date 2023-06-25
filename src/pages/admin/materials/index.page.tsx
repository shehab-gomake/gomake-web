import { AdminAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/materials/categories-table";

export default function CustomerMachinesPage() {
  return (
    <div>
      <AdminAuthLayout>
        <h1>Materials</h1>
        <CategoriesTable admin={true} />
      </AdminAuthLayout>
    </div>
  );
}
