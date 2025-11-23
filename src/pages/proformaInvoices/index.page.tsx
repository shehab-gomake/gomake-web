import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

export default function ProformaInvoices() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"proforma invoices"}
      className={`custom-scrollbar`}
    >
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.proformaInvoice} />
    </CustomerAuthLayout>
  );
}
