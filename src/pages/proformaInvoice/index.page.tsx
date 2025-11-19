import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";

export default function ProformaInvoice() {
  return (
    <CustomerAuthLayout staticPageTitle={"proforma invoice"}>
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.proformaInvoice} />
    </CustomerAuthLayout>
  );
}
