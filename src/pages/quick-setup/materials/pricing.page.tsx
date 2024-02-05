import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {CustomerAuthLayout} from "@/layouts";
import {
    QuickSetupMaterialStepComponent
} from "@/widgets/quick-setup-widgets/materials/quick-setup-material-step/quick-setup -material-step-component";

export default function QuickSetupPersonalPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'}
                              headerColor={'cyan'}>
                <QuickSetupMaterialStepComponent/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}