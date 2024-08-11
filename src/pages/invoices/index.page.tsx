import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { Permissions } from "../../components/CheckPermission/enum";

export default function Invoices() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_INVOICES} className={`custom-scrollbar`}>
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.invoice} />
    </CustomerAuthLayout>
  );
}
