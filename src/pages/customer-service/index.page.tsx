import { CustomerAuthLayout } from "@/layouts";
import { CustomerServicePageWidget } from "@/pages-components/customer-service/customer-service";

export default function CustomerServicePage() {
  return (
    <CustomerAuthLayout staticPageTitle={"customer service"} className={`custom-scrollbar`}>
      <CustomerServicePageWidget isAdmin={false} />
    </CustomerAuthLayout>
  );
}
