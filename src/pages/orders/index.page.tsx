import { CustomerAuthLayout } from "@/layouts";
import { OrdersListPageWidget } from "@/pages-components/orders/orders";

export default function Orders() {
  return (
    <CustomerAuthLayout>
      <OrdersListPageWidget />
    </CustomerAuthLayout>
  );
}
