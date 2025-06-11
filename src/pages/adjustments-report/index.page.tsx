import { CustomerAuthLayout } from "@/layouts";
import { TransactionJournalReportWidget } from "@/pages-components/transaction-journal-report/transaction-journal-report";
import { Permissions } from "../../components/CheckPermission/enum";
import { EReportType } from "@/enums";

export default function AdjustmentsReportPage() {
  return (
    <CustomerAuthLayout
      permissionEnumValue={Permissions.SHOW_TRANSACTION_JOURNAL_REPORT}
      className={`custom-scrollbar`}
      staticPageTitle="adjustments report"
    >
      <TransactionJournalReportWidget
        reportType={EReportType.AdjustmentsReport}
      />
    </CustomerAuthLayout>
  );
}
