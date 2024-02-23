import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {SignupPersonalForm} from "@/widgets/quick-setup-widgets/personal/signup-personal-form";

export default function QuickSetupPersonalPage() {
    return (
        <QuickSetupLayout pageTitle={'Let\'s get personal. Share your details with us!'} headerColor={'primary'}>
            <SignupPersonalForm/>
        </QuickSetupLayout>
    );
}