import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {MachinesSetupWidget} from "@/widgets/quick-setup-widgets/machines/machines-setup-widget";
import {CustomerAuthLayout} from "@/layouts";

export default function QuickSetupMachinesPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'}
                              headerColor={'primary'}>
                <MachinesSetupWidget/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}