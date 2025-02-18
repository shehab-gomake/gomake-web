import { Tab } from "./mobile-tab";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "../use-auth-layout-hook";

import { useUserPermission } from "@/hooks/use-permission";

const TopListLayout = () => {
  const { tabs1, tabs2, tabs3 } = useAuthLayoutHook(null, true);
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
        }}
      >
        {tabs2.every((tab) => tab.Permission === false) ? (
          <div style={classes.lineContainer}>
            <div style={classes.line} />
          </div>
        ) : (
          [...tabs2, ...tabs3].map((tab) => {
            if (tab.isLine) {
              return (
                <div style={classes.lineContainer} key={tab.key}>
                  <div style={classes.line} />
                </div>
              );
            } else if (checkTabPermissions(tab)) {
              return (
                <div data-tour={`${tab?.tourData}`}>
                  <Tab key={tab.key} tab={tab} />
                </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
};

export { TopListLayout };
