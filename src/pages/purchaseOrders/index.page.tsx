import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

export default function PurchaseOrders() {
  return (
    <CustomerAuthLayout>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.purchaseOrder} />
    </CustomerAuthLayout>
  );
}
