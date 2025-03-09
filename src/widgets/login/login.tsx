// login page
import { LoginLeftSide } from "./left-side/left-side";
import { LoginRightSide } from "./right-side/right-side";
import { useStyle } from "./style";
import { useEffect, useState } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useMediaQuery, useTheme } from "@mui/material";

const LoginWidget = () => {
  const { classes } = useStyle();
  const theme = useTheme();
  const { t, getCompanyLogo } = useCompanyProfile();
  const [isClient, setIsClient] = useState(false);
  // const isMobile = useMediaQuery("(max-width: 768px)");

  // i.e., < 600px
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: false,
  });

  useEffect(() => {
    setIsClient(true);
    getCompanyLogo().then();
    localStorage.removeItem("auth-token");
  }, []);

  if (!isClient) return null;

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
