import { CustomerAuthLayout } from "@/layouts";
import { HpComparisonWidget } from "@/pages-components/hp-comparison";

export default function HpComparisonPage() {
  return (
    <CustomerAuthLayout
      className={`custom-scrollbar`}
      staticPageTitle={"HP Indigo Report"}
    >
      <HpComparisonWidget />
    </CustomerAuthLayout>
  );
}


