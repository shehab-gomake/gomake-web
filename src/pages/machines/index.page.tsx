import { CustomerAuthLayout } from "@/layouts";
import { CategoriesTable } from "@/widgets/machines/components/categories-table/categories-table";

export default function CustomerMachinesPage() {
  return (
    <CustomerAuthLayout>
      <CategoriesTable isAdmin={false} />
    </CustomerAuthLayout>
  );
}
