import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HpTab } from "./tab";
import { useAuthLayoutHook } from "@/layouts/customer-auth-layout/use-auth-layout-hook";
import { useRecoilValue } from "recoil";
import { useUserPermission } from "@/hooks/use-permission";
import { useState } from "react";
import { printHouseHasAIFeature } from "@/store/print-house-profile";
import { HpArrowIcon } from "./arrow-icon";
import { adaptRight } from "@/utils/adapter";
import { HpLogoIcon } from "@/themes/hp-client/icons/HpLogoIcon";

const HpLeftSideLayout = ({ customGap }: { customGap?: number }) => {
  const { t } = useTranslation();
  const { tabs1, tabs2, tabs3, tabs4 } = useAuthLayoutHook(null, true);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const { CheckPermission } = useUserPermission();
  const { classes } = useStyle({
    navStatus: { isClosed: isSidebarClosed },
    customGap,
  });
  const hasAIFeature = useRecoilValue(printHouseHasAIFeature);

  const checkTabPermissions = (tab: any) => {
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

    // Special check for GomakeAI tab: requires both permission AND AI feature
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
    <div style={classes.sidebar}>
      {/* Header Section */}
      <div style={classes.header}>
        <div style={classes.headerContent}>
          {/* Logo Circle */}
          <div style={classes.logoCircle}>
            <HpLogoIcon />
          </div>
          {/* Company Name and Tagline */}
          {!isSidebarClosed && (
            <div style={classes.headerText}>
              <div style={classes.companyName}>HP XXX</div>
              <div style={classes.poweredBy}>powered by GoMake</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={classes.navigation}>
        <div style={classes.menuContainer}>
          {tabs1.map((tab, i) => {
            if (tab.isLine) {
              return null; // Skip lines in HP design
            } else if (checkTabPermissions(tab)) {
              return (
                <div key={tab.key} data-tour={`${tab?.tourData}`}>
                  <HpTab
                    tab={tab}
                    customGap={customGap}
                    isSidebarClosed={isSidebarClosed}
                  />
                </div>
              );
            }
          })}
          {hasTabs2 &&
            tabs2.map((tab, i) => {
              if (tab.isLine) {
                return null;
              } else if (checkTabPermissions(tab)) {
                return (
                  <div key={tab.key} data-tour={`${tab?.tourData}`}>
                    <HpTab
                      tab={tab}
                      customGap={customGap}
                      isSidebarClosed={isSidebarClosed}
                    />
                  </div>
                );
              }
            })}
          {hasTabs3 &&
            tabs3.map((tab, i) => {
              if (tab.isLine) {
                return null;
              } else if (checkTabPermissions(tab)) {
                return (
                  <div key={tab.key} data-tour={`${tab?.tourData}`}>
                    <HpTab
                      tab={tab}
                      customGap={customGap}
                      isSidebarClosed={isSidebarClosed}
                    />
                  </div>
                );
              }
            })}
          {hasTabs4 &&
            tabs4.map((tab, i) => {
              if (tab.isLine) {
                return null;
              } else if (checkTabPermissions(tab)) {
                return (
                  <div key={tab.key} data-tour={`${tab?.tourData}`}>
                    <HpTab
                      tab={tab}
                      customGap={customGap}
                      isSidebarClosed={isSidebarClosed}
                    />
                  </div>
                );
              }
            })}
        </div>
      </div>

      {/* Divider (only visible when closed) */}
      {isSidebarClosed && (
        <div
          style={{
            position: "absolute",
            width: "59px",
            height: "1px",
            left: "0px",
            top: "845px",
            background: "#E0E0E0",
          }}
        />
      )}

      {/* Collapse Button */}
      <div
        style={{
          position: "absolute",
          ...(isSidebarClosed
            ? { left: "16px", right: "auto" }
            : adaptRight(t("direction"), 172)),
          top: 864,
          cursor: "pointer",
          background: "transparent",
          padding: "4px",
          borderRadius: "32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "28px",
          height: "28px",
          border: "1px solid #024AD8",
          transition: "all 0.3s ease",
        }}
        onClick={() => {
          setIsSidebarClosed(!isSidebarClosed);
        }}
      >
        <HpArrowIcon isOpen={isSidebarClosed} />
      </div>
    </div>
  );
};

export { HpLeftSideLayout };
