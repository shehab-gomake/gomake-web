import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { Permissions } from "../../components/CheckPermission/enum";

export default function PurchaseOrders() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_PURCHASE_ORDERS}>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.purchaseOrder} />
    </CustomerAuthLayout>
  );
}
