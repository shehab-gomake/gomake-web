import { CustomerAuthLayout } from "@/layouts";
import { SalesReportWidget } from "@/pages-components/sales-report/sales-report";
import { Permissions } from "../../components/CheckPermission/enum";
import { CLIENT_TYPE } from "../customers/enums";

export default function SalesReportPage() {
  return (
    <CustomerAuthLayout
      permissionEnumValue={Permissions.SHOW_SALES_REPORT}
      className={`custom-scrollbar`}
      staticPageTitle={"sales report"}
    >
      <SalesReportWidget clientType={CLIENT_TYPE.CUSTOMER} />
    </CustomerAuthLayout>
  );
}
