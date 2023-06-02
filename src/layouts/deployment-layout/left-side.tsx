import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Tab } from "./tab";
import { HomeIcon } from "@/icons";

const LeftSideLayout = () => {
  const { clasess } = useStyle({});
  const { t } = useTranslation();
  return (
    <div style={clasess.leftContainer}>
      <div style={clasess.tabsContainer}>
        {[
          {
            isLine: false,
            key: "home",
            title: t("tabs.home"),
            path: "/home/index",
            isList: false,
            icon: () => {
              return <HomeIcon />;
            },
          },
        ].map((tab) => {
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
