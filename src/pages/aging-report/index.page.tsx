import { CustomerAuthLayout } from "@/layouts";
import { AgingReportWidget } from "@/pages-components/aging-report/aging-report";

export default function AgingReportPage() {
  return (
    <CustomerAuthLayout>
      <AgingReportWidget />
    </CustomerAuthLayout>
  );
}
