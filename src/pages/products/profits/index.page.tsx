import { CustomerAuthLayout } from "@/layouts";
import { ProfitsNewPageWidget } from "@/pages-components/products/profits-new/profits";

export default function Profits() {
  return (
    <CustomerAuthLayout customGap={0}>
      <ProfitsNewPageWidget />
    </CustomerAuthLayout>
  );
}
