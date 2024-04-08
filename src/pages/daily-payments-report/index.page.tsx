import { CustomerAuthLayout } from "@/layouts";
import { TransactionJournalReportWidget } from "@/pages-components/transaction-journal-report/transaction-journal-report";
import { Permissions } from "../../components/CheckPermission/enum";

export default function TransactionJournalReportPage() {
  return (
    <CustomerAuthLayout  permissionEnumValue={Permissions.SHOW_DAILY_PAYMENT_REPORT}>
      <TransactionJournalReportWidget isPayment={true} />
    </CustomerAuthLayout>
  );
}
