import { CustomerAuthLayout } from "@/layouts";
import { TransactionJournalReportWidget } from "@/pages-components/transaction-journal-report/transaction-journal-report";
import { Permissions } from "../../components/CheckPermission/enum";
import { EReportType } from "@/enums";

export default function TransactionJournalReportPage() {
  return (
    <CustomerAuthLayout 
      staticPageTitle={"daily payments report"}
      permissionEnumValue={Permissions.SHOW_DAILY_PAYMENT_REPORT}
      className={`custom-scrollbar`}
    >
      <TransactionJournalReportWidget reportType={EReportType.DailyPayments} />
    </CustomerAuthLayout>
  );
}
