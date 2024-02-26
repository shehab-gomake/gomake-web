import { CustomerAuthLayout } from "@/layouts";
import { AgingReportWidget } from "@/pages-components/aging-report/aging-report";

export default function LedgerReportPage() {
  return (
    <CustomerAuthLayout>
      <AgingReportWidget />
    </CustomerAuthLayout>
  );
}
