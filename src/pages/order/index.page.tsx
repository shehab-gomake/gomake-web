import { CustomerAuthLayout } from "@/layouts";
import { OrderPageWidget } from "@/pages-components/order/order";

export default function Order() {
  return (
    <CustomerAuthLayout>
      <OrderPageWidget />
    </CustomerAuthLayout>
  );
}
