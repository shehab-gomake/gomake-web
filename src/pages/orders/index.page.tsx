import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";

export default function Orders() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_ORDERS}>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.order} />
    </CustomerAuthLayout>
  );
}
