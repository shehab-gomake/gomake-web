import { Permissions } from "@/components/CheckPermission/enum";
import {CustomerAuthLayout} from "@/layouts";
import {SettingsWidget} from "@/widgets/settings/settings";

export default function SettingsPages() {

    return (
        <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_SETTINGS}>
            <SettingsWidget/>
        </CustomerAuthLayout>
    );
}
