import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { CustomerAuthLayout } from "@/layouts";
import { FONT_FAMILY } from "@/utils/font-family";
import { CategoriesTable } from "@/widgets/materials/categories-table";

export default function CustomerMachinesPage() {
  const { primaryColor } = useGomakeTheme();
  return (
    <CustomerAuthLayout>
      <h1
        style={{
          ...FONT_FAMILY.Lexend(700, 20),
          color: primaryColor(500),
          marginBottom: 20,
        }}
      >
        Categories
      </h1>
      <CategoriesTable />
    </CustomerAuthLayout>
  );
}
