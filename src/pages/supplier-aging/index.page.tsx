import { CustomerAuthLayout } from "@/layouts";
import { AgingReportWidget } from "@/pages-components/aging-report/aging-report";
import { CLIENT_TYPE } from "../customers/enums";
import { Permissions } from "../../components/CheckPermission/enum";

export default function SupplierAgingPage() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"Supplier Aging Report"}
      permissionEnumValue={Permissions.SHOW_SUPPLIER_AGING_REPORT}
      className={`custom-scrollbar`}
    >
      <AgingReportWidget clientType={CLIENT_TYPE.SUPPLIER} />
    </CustomerAuthLayout>
  );
}
