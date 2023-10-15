import { LoginByCodeLeftSide } from "./left-side/left-side";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { LoginRightSide } from "../login/right-side/right-side";

const LoginByCodeWidget = () => {
  const { clasess } = useStyle();
  const { getCompanyLogo } = useCompanyProfile();
  useEffect(() => {
    getCompanyLogo().then();
  }, []);
  return (
    <div style={clasess.container}>
      <LoginByCodeLeftSide />
      <LoginRightSide />
    </div>
  );
};
export { LoginByCodeWidget };
