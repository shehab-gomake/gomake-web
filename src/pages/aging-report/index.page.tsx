import { CustomerAuthLayout } from "@/layouts";
import { AgingReportWidget } from "@/pages-components/aging-report/aging-report";
import { Permissions } from "../../components/CheckPermission/enum";

export default function AgingReportPage() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_AGING_REPORT}>
      <AgingReportWidget />
    </CustomerAuthLayout>
  );
}
