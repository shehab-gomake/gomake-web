import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { Permissions } from "../../components/CheckPermission/enum";

export default function invoicesRefund() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_INVOICES_REFUND}>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.invoiceRefund} />
    </CustomerAuthLayout>
  );
}
