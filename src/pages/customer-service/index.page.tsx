import { CustomerAuthLayout } from "@/layouts";
import { CustomerServicePageWidget } from "@/pages-components/customer-service/customer-service";

export default function CustomerServicePage() {
  return (
    <CustomerAuthLayout>
      <CustomerServicePageWidget isAdmin={false} />
    </CustomerAuthLayout>
  );
}
