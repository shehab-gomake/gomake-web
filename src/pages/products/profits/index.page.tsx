import { CustomerAuthLayout } from "@/layouts";
import { ProfitsNewPageWidget } from "@/pages-components/products/profits-new/profits";
import { ProfitsPageWidget } from "@/pages-components/products/profits/profits";

export default function Profits() {
  return (
    <CustomerAuthLayout withGap={false}>
      {/* <ProfitsPageWidget /> */}
      <ProfitsNewPageWidget />
    </CustomerAuthLayout>
  );
}
