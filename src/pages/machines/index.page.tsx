import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { CustomerMachinesGrouped } from "@/widgets/machines/customer/customer-machines-grouped";

export default function CustomerMachinesPage() {
  return (
    <CustomerAuthLayout staticPageTitle={"machines"} permissionEnumValue={Permissions.SHOW_MACHINES} className={`custom-scrollbar`}>
      <CustomerMachinesGrouped />
    </CustomerAuthLayout>
  );
}
