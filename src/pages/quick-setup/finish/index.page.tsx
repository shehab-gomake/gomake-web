import {CustomerAuthLayout} from "@/layouts";
import {QuickSetupFinishPageWidget} from "@/widgets/quick-setup-widgets/finish-page/quick-setup-finish-page-widget";

export default function QuickSetupFinishPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupFinishPageWidget/>
        </CustomerAuthLayout>
    );
}