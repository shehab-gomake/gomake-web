import { CustomerAuthLayout } from "@/layouts";
import { DepositsListPageWidget } from "@/pages-components/deposits/deposits";
import { Permissions } from "../../components/CheckPermission/enum";

export default function Deposits() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_DEPOSITS}>
        <DepositsListPageWidget/>
    </CustomerAuthLayout>
  );
}
