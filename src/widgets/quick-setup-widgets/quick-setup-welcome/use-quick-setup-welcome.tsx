import { ActivateYourAccount } from "./icons/activate-account-icon";
import { DiveIntoGoMake } from "./icons/dive-gomake-icon";
import { NeedAssistance } from "./icons/need-assistance";
import { ThankYouForChoosingGoMake } from "./icons/thank-you";
import { VerifyYourEmail } from "./icons/verify-email-icon";


const useQuickSetupWelcome = () => {
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
  return {
    data
  };
};

export { useQuickSetupWelcome };
