import { CustomerAuthLayout } from "@/layouts";
import { DepositsListPageWidget } from "@/pages-components/deposits/deposits";
import { Permissions } from "../../components/CheckPermission/enum";

export default function Deposits() {
  return (
    <CustomerAuthLayout staticPageTitle={"deposits"} permissionEnumValue={Permissions.SHOW_DEPOSITS} className={`custom-scrollbar`}>
      <DepositsListPageWidget />
    </CustomerAuthLayout>
  );
}
