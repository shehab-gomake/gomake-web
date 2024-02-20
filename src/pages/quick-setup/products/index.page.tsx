import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {CustomerAuthLayout} from "@/layouts";
import {
    QuickSetupProductsComponent
} from "@/widgets/quick-setup-widgets/products/quick-setup-products-component";

export default function QuickSetupPersonalPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'}
                              headerColor={'magenta'}>
                <QuickSetupProductsComponent/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}