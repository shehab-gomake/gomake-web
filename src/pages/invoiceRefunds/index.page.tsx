import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";

export default function invoicesRefund() {
  return (
    <CustomerAuthLayout>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.invoiceRefund} />
    </CustomerAuthLayout>
  );
}
