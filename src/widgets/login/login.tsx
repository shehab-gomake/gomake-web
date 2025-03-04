// login page
import { LoginLeftSide } from "./left-side/left-side";
import { LoginRightSide } from "./right-side/right-side";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useMediaQuery } from "@mui/material";

const LoginWidget = () => {
  const { classes } = useStyle();
  const { t, getCompanyLogo } = useCompanyProfile();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    getCompanyLogo().then();
    localStorage.removeItem("auth-token");
  }, []);

  return isMobile ? (
    <div style={classes.mobileContainer}>
      <LoginLeftSide />
      <div style={classes.poweredContainer}>
        <div style={classes.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={classes.goMakeByLbl}>{t("login.GoMake")}</div>
      </div>
    </div>
  ) : (
    <div>
      <div style={classes.container}>
        <LoginLeftSide />
        <LoginRightSide />
      </div>
    </div>
  );
};

export { LoginWidget };
