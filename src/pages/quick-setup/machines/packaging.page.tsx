import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {MachinesSetupWidget} from "@/widgets/quick-setup-widgets/machines/machines-setup-widget";
import {CustomerAuthLayout} from "@/layouts";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

export default function QuickSetupMachinesRequiredPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'}
                              headerColor={'primary'}>
                <MachinesSetupWidget nextStep={'/quick-setup/machines'} categories={[
                    ECategoryId.SHRINK_PACKING_MACHINE,
                    ECategoryId.PACKAGE_TYING_MACHINE,
                    ECategoryId.CARTOON_PACKAGING_MACHINE
                ]}/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}