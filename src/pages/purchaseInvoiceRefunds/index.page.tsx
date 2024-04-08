import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { Permissions } from "../../components/CheckPermission/enum";

export default function PurchaseInvoiceRefund() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_PURCHASE_INVOICES_REFUND}>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.purchaseInvoiceRefund} />
    </CustomerAuthLayout>
  );
}
