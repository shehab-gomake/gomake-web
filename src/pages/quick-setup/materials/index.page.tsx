import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {CustomerAuthLayout} from "@/layouts";
import {QuickSetupMaterials} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials";

export default function QuickSetupMaterialsPage() {

    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'} headerColor={'cyan'}>
                <QuickSetupMaterials/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}