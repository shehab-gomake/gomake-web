import { LoginLeftSide } from "./left-side/left-side";
import { LoginRightSide } from "./right-side/right-side";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";

const LoginWidget = () => {
  const { clasess } = useStyle();
  const { getCompanyLogo } = useCompanyProfile();
  useEffect(() => {
    getCompanyLogo().then();
    localStorage.removeItem("auth-token");
  }, [])
  return (
    <div style={clasess.container}>
      <LoginLeftSide />
      <LoginRightSide />
    </div>
  );
};
export { LoginWidget };
