import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";

export default function PurchaseOrder() {
  return (
    <CustomerAuthLayout staticPageTitle={"purchase order"}>
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.purchaseOrder} />
    </CustomerAuthLayout>
  );
}
