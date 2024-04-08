import {CustomerAuthLayout} from "@/layouts";
import {CompanyReportWidget} from "@/pages-components/company-reports/company-report";
import {Permissions} from "@/components/CheckPermission/enum";

export default function Order() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_COMPANY_REPORTS}>
        <CompanyReportWidget/>
    </CustomerAuthLayout>
  );
}
