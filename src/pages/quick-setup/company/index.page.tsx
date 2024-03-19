import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {SignupCompanyForm} from "@/widgets/quick-setup-widgets/company/signup-company-form";

export default function QuickSetupCompanyPage() {
    return (
        <QuickSetupLayout pageTitle={'Let\'s get personal. Share your details with us!'} headerColor={'primary'}>
            <SignupCompanyForm/>
        </QuickSetupLayout>
    );
}