import { CustomerAuthLayout } from "@/layouts";
import { AgingReportWidget } from "@/pages-components/aging-report/aging-report";
import { Permissions } from "../../components/CheckPermission/enum";
import { CLIENT_TYPE } from "../customers/enums";

export default function AgingReportPage() {
  return (
    <CustomerAuthLayout staticPageTitle="aging report"
      permissionEnumValue={Permissions.SHOW_AGING_REPORT}
      className={`custom-scrollbar`}
    >
      <AgingReportWidget clientType={CLIENT_TYPE.CUSTOMER} />
    </CustomerAuthLayout>
  );
}
