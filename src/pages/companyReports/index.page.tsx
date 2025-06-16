import { CustomerAuthLayout } from "@/layouts";
import { CompanyReportWidget } from "@/pages-components/company-reports/company-report";
import { Permissions } from "@/components/CheckPermission/enum";

export default function CompanyReport() {
  return (
    <CustomerAuthLayout
      staticPageTitle="company report"
      permissionEnumValue={Permissions.SHOW_PRINTHOUSES_TABLE}
      className={`custom-scrollbar`}
    >
      <CompanyReportWidget />
    </CustomerAuthLayout>
  );
}
