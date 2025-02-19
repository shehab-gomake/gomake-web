import { Tab } from "./mobile-tab";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "../use-auth-layout-hook";
import { useUserPermission } from "@/hooks/use-permission";

const TopListLayout = () => {
  const { tabs1, tabs2, tabs3, tabs4 } = useAuthLayoutHook(null, true);
  const { CheckPermission } = useUserPermission();
  const { classes } = useStyle();

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
      </div>
    </div>
  );
};

export { TopListLayout };
