import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { OrdersListPageWidget } from "@/pages-components/orders/orders";

export default function Orders() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_ORDERS}>
      <OrdersListPageWidget />
    </CustomerAuthLayout>
  );
}
