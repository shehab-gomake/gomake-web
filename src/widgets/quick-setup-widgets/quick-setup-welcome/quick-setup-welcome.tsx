import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { SignupCompanyForm } from "../company/signup-company-form";
import { HandQuickSetupIcon } from "@/icons";
import { VerifyYourEmail } from "./icons/verify-email-icon";
import { ThankYouForChoosingGoMake } from "./icons/thank-you";
import { DiveIntoGoMake } from "./icons/dive-gomake-icon";
import { NeedAssistance } from "./icons/need-assistance";
import { ActivateYourAccount } from "./icons/activate-account-icon";
import { GomakePrimaryButton } from "@/components";

const QuickSetupWelcomeWidget = () => {

    const { classes } = useStyle();
    const { t } = useTranslation();
    const data = [
        {
            title: "Verify Your Email",
            icon: <VerifyYourEmail />,
            description: "Please check your inbox for a welcome email from us. This email contains your username and a temporary password, along with a verification link. If you don't see the email, remember to check your spam folder as well."
        },
        {
            title: "Activate Your Account",
            icon: <ActivateYourAccount />,
            description: "Secure and activate your account by clicking on the verification link in your email. This step confirms your identity and unlocks your access to GoMake."
        },
        {
            title: "Dive into GoMake",
            icon: <DiveIntoGoMake />,
            description: "Once your account is active, you can log in and explore the diverse features designed to enhance your productivity and simplify your printing operations."
        },
        {
            title: "Need Assistance?",
            icon: <NeedAssistance />,
            description: <>If the email doesn’t arrive, or if you encounter any issues during your setup, please contact our support team at <span style={{ color: '#118999', textDecoration: 'underline' }}>support@gomake.com</span>. We're here to help!</>
        },
        {
            title: "Thank You for Choosing GoMake!",
            icon: <ThankYouForChoosingGoMake />,
            description: "Prepare to streamline your printing operations and experience efficiency like never before."
        },
    ]

    return (
        <div style={classes.mainContainer}>
            <div style={classes.leftSide}>
                {
                    data?.map((item, index) => {
                        return (
                            <div style={classes.mainItemContainer}>
                                <div>
                                    {item.icon}
                                </div>
                                <div style={classes.itemColumnContainer}>
                                    <div style={classes.titleListStyle}> {item.title}</div>
                                    <div style={classes.descriptionListStyle}> {item.description}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div style={classes.rightSide}>
                <HandQuickSetupIcon />
                <div style={classes.welcomeTextStyle}>Welcome to Gomake </div>
                <div style={classes.subTitleTextStyle}>Congratulations on Starting Your Journey with Us!</div>
                <div style={classes.descriptionTextStyle}>
                    Your GoMake account is set up, and we're excited to welcome you to our community of printing professionals. You're just a few steps away from harnessing the full power of our platform.
                </div>
                <GomakePrimaryButton style={classes.btnContainer}>
                    Get started
                </GomakePrimaryButton>

            </div>
        </div>
    )
}

export { QuickSetupWelcomeWidget }