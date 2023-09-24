import { CustomerAuthLayout } from "@/layouts";
import { ProfitsPageWidget } from "@/pages-components/products/profits/profits";

export default function Profits() {
  return (
    <CustomerAuthLayout>
      <ProfitsPageWidget />
    </CustomerAuthLayout>
  );
}
