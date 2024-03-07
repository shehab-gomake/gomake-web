import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {CustomerAuthLayout} from "@/layouts";
import {
    QuickSetupProductsComponent
} from "@/widgets/quick-setup-widgets/products/quick-setup-products-component";

export default function QuickSetupPersonalPage() {
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'signup.productsPageTitle'}
                              headerColor={'magenta'}>
                <QuickSetupProductsComponent/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}