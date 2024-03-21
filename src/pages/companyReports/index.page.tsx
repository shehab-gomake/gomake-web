import { CustomerAuthLayout } from "@/layouts";
import { CompanyReportWidget } from "@/pages-components/company-reports/company-report";

export default function Order() {
  return (
    <CustomerAuthLayout>
        <CompanyReportWidget/>
    </CustomerAuthLayout>
  );
}
