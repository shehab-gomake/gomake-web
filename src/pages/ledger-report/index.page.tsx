import { CustomerAuthLayout } from "@/layouts";
import { LedgerReportWidget } from "@/pages-components/ledger-report/ledger-report";
import { Permissions } from "../../components/CheckPermission/enum";

export default function LedgerReportPage() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_LEDGER_REPORT}>
      <LedgerReportWidget />
    </CustomerAuthLayout>
  );
}
