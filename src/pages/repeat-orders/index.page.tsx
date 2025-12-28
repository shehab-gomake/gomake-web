import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "../../components/CheckPermission/enum";
import { RepeatOrdersWidget } from "@/pages-components/repeat-orders/repeat-orders";

export default function RepeatOrders() {
  return (
    <CustomerAuthLayout
      staticPageTitle={"repeat orders"}
      permissionEnumValue={Permissions.SHOW_BOARD_MISSIONS}
      className={`custom-scrollbar`}
    >
      <RepeatOrdersWidget />
    </CustomerAuthLayout>
  );
}
