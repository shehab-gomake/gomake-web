import { ForgotPasswordLeftSide } from "./left-side/left-side";
import { useStyle } from "./style";
import { useEffect, useState } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { LoginRightSide } from "../login/right-side/right-side";
import { useMediaQuery, useTheme } from "@mui/material";

const ForgotPasswordWidget = () => {
  const { classes } = useStyle();
  const { getCompanyLogo } = useCompanyProfile();
  const [isClient, setIsClient] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: false,
  });

  useEffect(() => {
    setIsClient(true);
    getCompanyLogo().then();
  }, []);

  if (!isClient) return null;

  return (
    <div style={classes.container}>
      <ForgotPasswordLeftSide isMobile={isMobile} />
      {!isMobile && <LoginRightSide />}
    </div>
  );
};

export { ForgotPasswordWidget };
