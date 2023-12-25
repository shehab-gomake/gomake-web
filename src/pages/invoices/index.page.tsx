import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/enums";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";

export default function Invoices() {
  return (
    <CustomerAuthLayout>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.INVOICE} />
    </CustomerAuthLayout>
  );
}
