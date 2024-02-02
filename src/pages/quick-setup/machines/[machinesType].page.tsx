import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {SignupPersonalForm} from "@/widgets/quick-setup-widgets/personal/signup-personal-form";
import {MachinesSetupWidget} from "@/widgets/quick-setup-widgets/machines/machines-setup-widget";
import {CustomerAuthLayout} from "@/layouts";

export default function QuickSetupPersonalPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'}
                              headerColor={'primary'}>
                <MachinesSetupWidget/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}