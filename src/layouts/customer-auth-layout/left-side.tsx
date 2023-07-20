import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { useRecoilState } from "recoil";
import { navStatusState } from "@/store/nav-status";
import { BackNavIcon } from "@/icons/back-nav";
import config from "@/config";

const LeftSideLayout = () => {
  const { t } = useTranslation();
  const { tabs } = useAuthLayoutHook();
  const [navStatus, setNavStatus] = useRecoilState(navStatusState);
  const displayedProductionTabs = tabs.filter((tab) => tab.isProduction);

  const { clasess } = useStyle({ navStatus });
  return (
    <div style={clasess.leftContainer}>
      <div
        style={{
          position: "absolute",
          left: navStatus.isClosed ? 176 : 265,
          top: navStatus.isClosed ? 50 : 80,
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

      <div style={clasess.logoContainer}>
        <Image
          src={"https://i.ibb.co/wzpwSq6/Group-1239.png"}
          alt="logo"
          width={100}
          height={100}
        />
      </div>

      <div style={clasess.tabsContainer}>
        {config.enviroment !== "dev"
          ? displayedProductionTabs.map((tab) => {
              if (tab.isLine) {
                return (
                  <div style={clasess.lineContainer}>
                    <div key={tab.key} style={clasess.line} />
                  </div>
                );
              } else {
                return <Tab key={tab.key} tab={tab} />;
              }
            })
          : tabs.map((tab) => {
              if (tab.isLine) {
                return (
                  <div style={clasess.lineContainer}>
                    <div key={tab.key} style={clasess.line} />
                  </div>
                );
              } else {
                return <Tab key={tab.key} tab={tab} />;
              }
            })}
      </div>

      <div style={clasess.poweredContainer}>
        <div style={clasess.poweredByLbl}>{t("login.poweredBy")}</div>
        <div style={clasess.gomakeByLbl}>{t("login.GoMake")}</div>
      </div>
    </div>
  );
};

export { LeftSideLayout };
