import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";

export default function PurchaseInvoiceRefund() {
  return (
    <CustomerAuthLayout>
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.purchaseInvoiceRefund} />
    </CustomerAuthLayout>
  );
}
