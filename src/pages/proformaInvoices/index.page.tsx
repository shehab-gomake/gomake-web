import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { Permissions } from "../../components/CheckPermission/enum";

export default function ProformaInvoices() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"proforma invoices"}
      permissionEnumValue={Permissions.SHOW_PROFORMA_INVOICES}
      className={`custom-scrollbar`}
    >
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.proformaInvoice} />
    </CustomerAuthLayout>
  );
}
