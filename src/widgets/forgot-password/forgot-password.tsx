import { ForgotPasswordLeftSide } from "./left-side/left-side";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { LoginRightSide } from "../login/right-side/right-side";
import { useMediaQuery } from "@mui/material";

const ForgotPasswordWidget = () => {
  const { classes } = useStyle();
  const { getCompanyLogo } = useCompanyProfile();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    getCompanyLogo().then();
  }, []);

  return (
    <div style={classes.container}>
      <ForgotPasswordLeftSide isMobile={isMobile} />
      {!isMobile && <LoginRightSide />}
    </div>
  );
};
export { ForgotPasswordWidget };
