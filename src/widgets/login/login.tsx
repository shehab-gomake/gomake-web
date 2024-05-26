// login page
import { LoginLeftSide } from "./left-side/left-side";
import { LoginRightSide } from "./right-side/right-side";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { TermModal } from "./terms-modal/TermModal";
import { useGomakeLogin } from "./use-login";

const LoginWidget = () => {
  const { clasess } = useStyle();
  const { getCompanyLogo } = useCompanyProfile();

  useEffect(() => {
    getCompanyLogo();
    localStorage.removeItem("auth-token");
  }, [getCompanyLogo]);

  return (
    <div>
      <div style={clasess.container}>
        <LoginLeftSide />
        <LoginRightSide />
      </div>
    </div>
  );
};

export { LoginWidget };
