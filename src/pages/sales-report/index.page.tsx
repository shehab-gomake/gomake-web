import { CustomerAuthLayout } from "@/layouts";
import { SalesReportWidget } from "@/pages-components/sales-report/sales-report";
import { Permissions } from "../../components/CheckPermission/enum";

export default function SalesReportPage() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_SALES_REPORT}>
      <SalesReportWidget />
    </CustomerAuthLayout>
  );
}
