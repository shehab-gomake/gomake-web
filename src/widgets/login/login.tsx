// login page
import { LoginLeftSide } from "./left-side/left-side";
import { LoginRightSide } from "./right-side/right-side";
import { useStyle } from "./style";
import { useEffect, useMemo, useState } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useMediaQuery, useTheme } from "@mui/material";
import { useMobileHeight } from "@/hooks/use-responsive";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useCreatePrintHouseTestSocketIo } from "@/hooks/socket-io/use-create-print-house-test-socket-io";

const LoginWidget = () => {
  const theme = useTheme();
  const { t, getCompanyLogo } = useCompanyProfile();
  const [isClient, setIsClient] = useState(false);
  const mobileHeight = useMobileHeight();
  const { classes } = useStyle(mobileHeight);
  const { data } = useCreatePrintHouseTestSocketIo();
  const [openAutomationModal, setOpenAutomationModal] = useState(false);

  useEffect(() => {
    if (data) {
      setOpenAutomationModal(true);
    }
  }, [data]);

  const loginLink = useMemo(() => {
    if (!data) return "";
    const isBrowser = typeof window !== "undefined";
    const origin = data.domain;
    const base = data.domain ? `https://${data.domain}` : origin;
    if (!base) return "";
    debugger;
    let url = base + "/login";
    if (data?.username && data?.password) {
      url = url + "?email=" + data.username + "&password=" + data.password;
    }
    return url;
  }, [data]);

  // const isMobile = useMediaQuery("(max-width: 768px)");

  // i.e., < 600px
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: false,
  });

  useEffect(() => {
    localStorage.clear();
    setIsClient(true);
    getCompanyLogo().then();
  }, []);

  if (!isClient) return null;

  return isMobile ? (
    <div style={classes.mobileContainer}>
      <LoginLeftSide />
      <div style={classes.poweredContainer}>
        <div style={classes.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={classes.goMakeByLbl}>{t("login.GoMake")}</div>
      </div>
      <GoMakeModal
        openModal={openAutomationModal}
        onClose={() => setOpenAutomationModal(false)}
        modalTitle={"Automation: createPrintHouseTest"}
        withClose
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            Domain: <b>{data?.domain}</b>
          </div>
          <div>
            Username: <b>{data?.username}</b>
          </div>
          <div>
            Password: <b>{data?.password}</b>
          </div>
          <div style={{ wordBreak: "break-all" }}>{loginLink}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <GomakePrimaryButton
              onClick={() => window.open(loginLink, "_self")}
            >
              Open Link
            </GomakePrimaryButton>
            <GomakePrimaryButton
              onClick={async () => {
                await navigator.clipboard.writeText(loginLink);
              }}
            >
              Copy Link
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </div>
  ) : (
    <div>
      <div style={classes.container}>
        <LoginLeftSide />
        <LoginRightSide />
      </div>
      <GoMakeModal
        openModal={openAutomationModal}
        onClose={() => setOpenAutomationModal(false)}
        modalTitle={"Automation: createPrintHouseTest"}
        withClose
        insideStyle={{ height: "fit-content" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            Domain: <b>{data?.domain}</b>
          </div>
          <div>
            Username: <b>{data?.username}</b>
          </div>
          <div>
            Password: <b>{data?.password}</b>
          </div>
          <div style={{ wordBreak: "break-all" }}>{loginLink}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <GomakePrimaryButton
              onClick={() => window.open(loginLink, "_self")}
            >
              Open Link
            </GomakePrimaryButton>
            <GomakePrimaryButton
              onClick={async () => {
                await navigator.clipboard.writeText(loginLink);
              }}
            >
              Copy Link
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </div>
  );
};

export { LoginWidget };
