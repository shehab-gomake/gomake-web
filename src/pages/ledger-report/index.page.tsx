import { CustomerAuthLayout } from "@/layouts";
import { LedgerReportWidget } from "@/pages-components/ledger-report/ledger-report";

export default function LedgerReportPage() {
  return (
    <CustomerAuthLayout>
      <LedgerReportWidget />
    </CustomerAuthLayout>
  );
}
