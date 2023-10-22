import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { ActionPageWidget } from "@/pages-components/actions/actions";

export default function ActionsPage() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_ACTIONS}>
      <ActionPageWidget />
    </CustomerAuthLayout>
  );
}
