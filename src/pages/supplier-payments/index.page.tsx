import { CustomerAuthLayout } from "@/layouts";
import { QuotesListPageWidget } from "@/pages-components/quotes/quotes";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { Permissions } from "../../components/CheckPermission/enum";

export default function SupplierPayments() {
  return (
    <CustomerAuthLayout
      permissionEnumValue={Permissions.SHOW_SUPPLIER_PAYMENTS}
      className={`custom-scrollbar`}
      staticPageTitle={"supplier payments"}
    >
      <QuotesListPageWidget documentType={DOCUMENT_TYPE.supplierPayments} />
    </CustomerAuthLayout>
  );
}
