import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "../../components/CheckPermission/enum";
import { FinancesWidget } from "@/widgets/finances";

export default function ExportFiles() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"export files"}
      permissionEnumValue={Permissions.SHOW_FINANCE}
      className={`custom-scrollbar`}
    >
      <FinancesWidget />
    </CustomerAuthLayout>
  );
}
