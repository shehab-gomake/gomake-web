import { CustomerAuthLayout } from "@/layouts";
import { SalesReportWidget } from "@/pages-components/sales-report/sales-report";
import { Permissions } from "../../components/CheckPermission/enum";
import { CLIENT_TYPE } from "../customers/enums";

export default function PurchasesReportPage() {
  return (
    <CustomerAuthLayout
      permissionEnumValue={Permissions.SHOW_PURCHASES_REPORT}
      className={`custom-scrollbar`}
    >
      <SalesReportWidget clientType={CLIENT_TYPE.SUPPLIER} />
    </CustomerAuthLayout>
  );
}
