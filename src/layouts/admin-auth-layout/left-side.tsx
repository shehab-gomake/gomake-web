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
  const [navStatus, setNavStatus] = useRecoilState(navStatusState);
  const { clasess } = useStyle({ navStatus });
  return (
    <div
      style={{
        ...clasess.leftContainer,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: navStatus.isClosed ? 35 : 265,
          top: navStatus.isClosed ? 20 : 80,
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
      {!navStatus.isClosed && (
        <div style={clasess.logoContainer}>Admin panel</div>
      )}
      <div style={clasess.tabsContainer}>
        {config.enviroment !== "dev"
          ? tabs.slice(3, 5).map((tab) => {
              if (tab.isLine) {
                return <div key={tab.key} style={clasess.line} />;
              } else {
                return <Tab key={tab.key} tab={tab} />;
              }
            })
          : tabs.map((tab) => {
              if (tab.isLine) {
                return <div key={tab.key} style={clasess.line} />;
              } else {
                return <Tab key={tab.key} tab={tab} />;
              }
            })}
      </div>
      {!navStatus.isClosed && (
        <div style={clasess.poweredContainer}>
          <div style={clasess.poweredByLbl}>{t("login.poweredBy")}</div>
          <div style={clasess.gomakeByLbl}>{t("login.GoMake")}</div>
        </div>
      )}
    </div>
  );
};

export { LeftSideLayout };
