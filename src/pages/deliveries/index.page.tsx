import { CustomerAuthLayout } from "@/layouts";
import { DeliveriesPageWidget } from "@/pages-components/deliveries/deliveries";

export default function DeliveriesPage() {
  return (
    <CustomerAuthLayout staticPageTitle={"deliveries"} className={`custom-scrollbar`}>
      <DeliveriesPageWidget />
    </CustomerAuthLayout>
  );
}
