import { CustomerAuthLayout } from "@/layouts";
import { LedgerReportWidget } from "@/pages-components/ledger-report/ledger-report";
import { Permissions } from "../../components/CheckPermission/enum";
import { CLIENT_TYPE } from "../customers/enums";

export default function LedgerReportPage() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"Ledger Report"}
      permissionEnumValue={Permissions.SHOW_LEDGER_REPORT}
      className={`custom-scrollbar`}
    >
      <LedgerReportWidget clientType={CLIENT_TYPE.CUSTOMER} />
    </CustomerAuthLayout>
  );
}
