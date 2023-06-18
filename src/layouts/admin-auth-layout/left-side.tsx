import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { useAuthLayoutHook } from "./use-admin-auth-layout-hook";

const LeftSideLayout = () => {
  const { clasess } = useStyle({});
  const { t } = useTranslation();
  const { tabs } = useAuthLayoutHook();
  return (
    <div style={clasess.leftContainer}>
      <div style={clasess.logoContainer}>Admin panel</div>
      <div style={clasess.tabsContainer}>
        {tabs.map((tab) => {
          if (tab.isLine) {
            return <div key={tab.key} style={clasess.line} />;
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
