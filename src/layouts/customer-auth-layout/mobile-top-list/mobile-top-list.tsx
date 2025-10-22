import { Tab } from "./mobile-tab";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "../use-auth-layout-hook";
import { useUserPermission } from "@/hooks/use-permission";
import { Stack } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { printHouseHasAIFeature } from "@/store/print-house-profile";

const TopListLayout = () => {
  const { tabs1, tabs2, tabs3, tabs4, handleLogout } = useAuthLayoutHook(
    null,
    true
  );
  const { CheckPermission } = useUserPermission();
  const { classes } = useStyle();
  const { t } = useTranslation();
  const hasAIFeature = useRecoilValue(printHouseHasAIFeature);

  const checkTabPermissions = (tab) => {
    if (tab.isList && tab.list) {
      for (let i = 0; i < tab.list.length; i++) {
        if (!tab.list[i].Permission) {
          return true;
        }
        if (CheckPermission(tab.list[i].Permission)) {
          return true;
        }
      }
      return false;
    } else if (tab.Permission && !CheckPermission(tab.Permission)) {
      return false;
    }

    // ✅ Special check for GomakeAI tab: requires both permission AND AI feature
    if (tab.key === "goAI" && !hasAIFeature) {
      return false;
    }

    return true;
  };

  const filterTabsWithPermission = (tabs: any) => {
    return tabs
      .filter((tab: any) => {
        if (tab.isLine) {
          return false;
        }
        return checkTabPermissions(tab);
      })
      .map((tab: any) => {
        // If it's a list, filter the list items based on Permission
        if (tab.isList && tab.list) {
          tab.list = tab.list.filter((item: any) => item.Permission);
        }
        return tab;
      });
  };

  const hasTabs2 = filterTabsWithPermission(tabs2).length > 0;
  const hasTabs3 = filterTabsWithPermission(tabs3).length > 0;
  const hasTabs4 = filterTabsWithPermission(tabs4).length > 0;

  return (
    <div style={classes.leftContainer}>
      <div style={classes.tabsContainer}>
        {tabs1.map((tab, i) => {
          if (tab.isLine) {
            return (
              <div style={classes.lineContainer}>
                <div key={tab.key} style={classes.line} />
              </div>
            );
          } else if (checkTabPermissions(tab)) {
            return (
              <div data-tour={`${tab?.tourData}`}>
                <Tab key={tab.key} tab={tab} />
              </div>
            );
          }
        })}
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "scroll",
          alignSelf: "flex-start",
          marginBottom: "10px",
        }}
      >
        {hasTabs2 &&
          tabs2.map((tab, i) => {
            if (tab.isLine) {
              return (
                <div style={classes.lineContainer}>
                  <div key={tab.key} style={classes.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return (
                <div data-tour={`${tab?.tourData}`}>
                  <Tab key={tab.key} tab={tab} />
                </div>
              );
            }
          })}

        {hasTabs3 &&
          tabs3.map((tab, i) => {
            if (tab.isLine) {
              return (
                <div style={classes.lineContainer}>
                  <div key={tab.key} style={classes.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return (
                <div data-tour={`${tab?.tourData}`}>
                  <Tab key={tab.key} tab={tab} />
                </div>
              );
            }
          })}
        {hasTabs4 &&
          tabs4.map((tab, i) => {
            if (tab.isLine) {
              return (
                <div style={classes.lineContainer}>
                  <div key={tab.key} style={classes.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return (
                <div data-tour={`${tab?.tourData}`}>
                  <Tab key={tab.key} tab={tab} />
                </div>
              );
            }
          })}
        <div style={classes.tabContainer} onClick={handleLogout}>
          <Stack direction={"row"} sx={{ gap: "10px" }}>
            <LogoutIcon />
            <div style={classes.tabTitle}>{t("login.logOut")}</div>
          </Stack>
          <div style={{ marginLeft: 5 }} />
        </div>
      </div>
    </div>
  );
};

export { TopListLayout };
