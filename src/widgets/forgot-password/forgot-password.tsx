import { ForgotPasswordLeftSide } from "./left-side/left-side";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { LoginRightSide } from "../login/right-side/right-side";

const ForgotPasswordWidget = () => {
  const { clasess } = useStyle();
  const { getCompanyLogo } = useCompanyProfile();
  useEffect(() => {
    getCompanyLogo().then();
  }, []);
  return (
    <div style={clasess.container}>
      <ForgotPasswordLeftSide />
      <LoginRightSide />
    </div>
  );
};
export { ForgotPasswordWidget };
