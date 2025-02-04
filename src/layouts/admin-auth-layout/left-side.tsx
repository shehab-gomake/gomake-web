import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { useAuthLayoutHook } from "./use-admin-auth-layout-hook";
import { BackNavIcon } from "@/icons/back-nav";
import { useRecoilState } from "recoil";
import { navStatusState } from "@/store/nav-status";
import config from "@/config";

const LeftSideLayout = () => {
  const { t } = useTranslation();
  const { tabs } = useAuthLayoutHook();
  const displayedProductionTabs = tabs.filter((tab) => tab.isProduction);
  const [navStatus, setNavStatus] = useRecoilState(navStatusState);
  const { classes } = useStyle({ navStatus });
  return (
    <div
      style={{
        ...classes.leftContainer,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: navStatus.isClosed ? 127 : 265,
          top: navStatus.isClosed ? 50 : 60,
          transform: navStatus.isClosed ? "rotate(180deg)" : "rotate(0)",
          // transform: "rotate(90deg)",
          zIndex: 10,
          cursor: "pointer",
        }}
        onClick={() => {
          setNavStatus({ isClosed: !navStatus.isClosed });
        }}
      >
        <BackNavIcon />
      </div>

      <div style={classes.logoContainer}>Admin panel</div>

      <div style={classes.tabsContainer}>
        {config.enviroment !== "dev"
          ? displayedProductionTabs.map((tab) => {
              if (tab.isLine) {
                return (
                  <div style={classes.lineContainer}>
                    <div key={tab.key} style={classes.line} />
                  </div>
                );
              } else {
                return <Tab key={tab.key} tab={tab} />;
              }
            })
          : tabs.map((tab) => {
              if (tab.isLine) {
                return (
                  <div style={classes.lineContainer}>
                    <div key={tab.key} style={classes.line} />
                  </div>
                );
              } else {
                return <Tab key={tab.key} tab={tab} />;
              }
            })}
      </div>

      <div style={classes.poweredContainer}>
        <div style={classes.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={classes.gomakeByLbl}>{t("login.GoMake")}</div>
      </div>
    </div>
  );
};

export { LeftSideLayout };
