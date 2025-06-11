import { Permissions } from "@/components/CheckPermission/enum";
import { CustomerAuthLayout } from "@/layouts";
import { ActionPageWidget } from "@/pages-components/actions/actions";

export default function ActionsPage() {
  return (
    <CustomerAuthLayout staticPageTitle="actions" permissionEnumValue={Permissions.SHOW_ACTIONS} className={`custom-scrollbar`}>
      <ActionPageWidget />
    </CustomerAuthLayout>
  );
}
