import { CustomerAuthLayout } from "@/layouts";
import { LedgerReportWidget } from "@/pages-components/ledger-report/ledger-report";
import { Permissions } from "../../components/CheckPermission/enum";
import { CLIENT_TYPE } from "../customers/enums";

export default function SupplierLedgerPage() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"Supplier Ledger Report"}
      permissionEnumValue={Permissions.SHOW_SUPPLIER_LEDGER_REPORT}
      className={`custom-scrollbar`}
    >
      <LedgerReportWidget clientType={CLIENT_TYPE.SUPPLIER} />
    </CustomerAuthLayout>
  );
}
