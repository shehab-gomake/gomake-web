import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {MachinesSetupWidget} from "@/widgets/quick-setup-widgets/machines/machines-setup-widget";
import {CustomerAuthLayout} from "@/layouts";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

export default function QuickSetupMachinesRequiredPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'}
                              headerColor={'primary'}>
                <MachinesSetupWidget nextStep={'/quick-setup/machines/cutting'}
                                     categories={[
                                         ECategoryId.DIGITAL_PRINTING,
                                         ECategoryId.OFSSET_PRINTING,
                                         ECategoryId.ROLL_DIGITAL_PRINTING,
                                         ECategoryId.FLEXO_PRINTING,
                                         ECategoryId.ROLL_WIDE_PRINTING,
                                         ECategoryId.SILK_PRINTER
                                     ]}/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}