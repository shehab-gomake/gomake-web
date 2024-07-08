import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerServicePageWidget } from "@/pages-components/customer-service/customer-service";

export default function CustomerServicePage() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_ADMIN_CUSTOMER_SERVICE}>
      <CustomerServicePageWidget isAdmin={true} />
    </CustomerAuthLayout>
  );
}
