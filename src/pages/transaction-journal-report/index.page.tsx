import { CustomerAuthLayout } from "@/layouts";
import { TransactionJournalReportWidget } from "@/pages-components/transaction-journal-report/transaction-journal-report";

export default function TransactionJournalReportPage() {
  return (
    <CustomerAuthLayout>
      <TransactionJournalReportWidget />
    </CustomerAuthLayout>
  );
}
