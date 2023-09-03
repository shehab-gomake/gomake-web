import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { useRecoilState } from "recoil";
import { navStatusState } from "@/store/nav-status";
import { BackNavIcon } from "@/icons/back-nav";
import config from "@/config";
import { adaptRight } from "@/utils/adapter";

const LeftSideLayout = () => {
  const { t } = useTranslation();
  const { tabs1, tabs2, tabs3 } = useAuthLayoutHook();
  const [navStatus, setNavStatus] = useRecoilState(navStatusState);
  const displayedProductionTabs = tabs1.filter((tab) => tab.isProduction);

  const { clasess } = useStyle({ navStatus });
  return (
    <div style={clasess.leftContainer}>
      <div
        style={{
          position: "absolute",
          ...adaptRight(t("direction"), navStatus.isClosed ? 127 : 265),
          top: navStatus.isClosed ? 50 : 60,
          transform: navStatus.isClosed ? "rotate(180deg)" : "rotate(0)",
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
        {tabs1.map((tab) => {
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
      <div
        style={{
          height: "100%",
          width: "100%",
          // background: "red",
          overflow: "scroll",
          alignSelf: "flex-start",
        }}
      >
        {tabs2.map((tab) => {
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
      <div style={clasess.lastTabsContainer}>
        {tabs3.map((tab) => {
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
