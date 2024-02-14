import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {CustomerAuthLayout} from "@/layouts";
import {
    QuickSetupCalculationComponent
} from "@/widgets/quick-setup-widgets/calculation/quick-setup-calculation-component";

export default function QuickSetupPersonalPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'}
                              headerColor={'magenta'}>
                <QuickSetupCalculationComponent/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}