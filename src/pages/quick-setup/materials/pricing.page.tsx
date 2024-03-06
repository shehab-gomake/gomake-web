import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {CustomerAuthLayout} from "@/layouts";
import {
    QuickSetupMaterialsPricingWidget
} from "@/widgets/quick-setup-widgets/materials/quick-setup-materials-pricing/quick-setup-materials-pricing-widget";

export default function QuickSetupPersonalPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'signup.materialsPricingPageTitle'}
                              headerColor={'cyan'}>
                <QuickSetupMaterialsPricingWidget/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}