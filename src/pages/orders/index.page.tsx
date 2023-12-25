import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/enums";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";

export default function Orders() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_ORDERS}>
      {/* <OrdersListPageWidget /> */}
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.ORDER} />
    </CustomerAuthLayout>
  );
}
