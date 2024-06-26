import { CustomerAuthLayout } from "@/layouts";
import { ActionPageWidget } from "@/pages-components/actions/actions";
import { CustomerServicePageWidget } from "@/pages-components/customer-service/customer-service";

export default function CustomerServicePage() {
  return (
    <CustomerAuthLayout >
      <CustomerServicePageWidget />
    </CustomerAuthLayout>
  );
}
