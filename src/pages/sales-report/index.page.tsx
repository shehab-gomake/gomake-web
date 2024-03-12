import { CustomerAuthLayout } from "@/layouts";
import { SalesReportWidget } from "@/pages-components/sales-report/sales-report";

export default function SalesReportPage() {
  return (
    <CustomerAuthLayout>
      <SalesReportWidget />
    </CustomerAuthLayout>
  );
}
