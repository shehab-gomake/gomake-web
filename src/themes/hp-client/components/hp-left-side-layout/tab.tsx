import { useCallback, useEffect, useState, useRef } from "react";
import { useStyle } from "./tab.style";
import { useGomakeRouter } from "@/hooks";
import { useRecoilState } from "recoil";
import { selectedTabState } from "@/store";
import { useTranslation } from "react-i18next";
import { useUserPermission } from "@/hooks/use-permission";
import Link from "next/link";
import { Collapse } from "@mui/material";
import { getHpIcon } from "./icons";
import { useRouter } from "next/router";

interface IProps {
  tab: {
    isLine?: boolean;
    key?: string;
    title?: string;
    path?: string;
    isList?: boolean;
    icon?: any;
    list?: any[];
    tourData?: string;
  };
  customGap?: number;
  isSidebarClosed?: boolean;
}

/**
 * HP Client Theme - Tab Component
 * New design based on Figma specifications
 */
const HpTab = ({ tab, customGap, isSidebarClosed = false }: IProps) => {
  const router = useRouter();
  const [selectedTabValue, setSelectedTabValue] =
    useRecoilState(selectedTabState);
  const { navigate } = useGomakeRouter();
  const [isListOpen, setIsListOpen] = useState(tab?.key === selectedTabValue);
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const prevPathRef = useRef<string>(router.pathname);

  // Check if current route matches this tab or any of its sub-items
  // Normalize paths by removing query parameters for comparison
  const normalizePath = (path: string) => {
    if (!path) return "";
    // Remove query parameters and hash
    return path.split("?")[0].split("#")[0];
  };

  const currentPath = router.pathname;
  const normalizedCurrentPath = normalizePath(currentPath);
  const normalizedTabPath = normalizePath(tab.path || "");

  const isCurrentRoute =
    normalizedCurrentPath === normalizedTabPath ||
    (tab.isList &&
      tab.list?.some(
        (subItem: any) =>
          normalizedCurrentPath === normalizePath(subItem.path || "")
      ));

  // Tab is selected only if current route matches (not just based on selectedTabValue)
  // This ensures selection is cleared when navigating away
  const isSelected = isCurrentRoute;
  const { classes, StyledMenuItem, StyledSubMenuItem } = useStyle({
    isSelected,
    navStatus: { isClosed: isSidebarClosed },
    customGap,
  });

  // Get HP-specific icon if available, otherwise use default icon
  const hpIcon = getHpIcon(tab?.key || "", isSelected);
  const iconToRender = hpIcon
    ? hpIcon(isSelected)
    : tab && tab?.icon
    ? tab.icon()
    : null;

  const onClickTab = useCallback(() => {
    if (tab.isList) {
      // Toggle selected tab value (this will trigger useEffect to open/close list)
      if (tab.key === selectedTabValue) {
        // If already selected, deselect (unless we're on a matching route)
        if (!isCurrentRoute) {
          setSelectedTabValue("");
        }
      } else {
        // If not selected, select it
        setSelectedTabValue(tab.key || "");
      }
    } else {
      changeRoute(tab.path);
      setSelectedTabValue(tab.key || "");
    }
  }, [tab, selectedTabValue, setSelectedTabValue, isCurrentRoute]);

  const changeRoute = useCallback((route: string) => {
    navigate(route);
  }, []);

  // Update list open state based on selection and route
  useEffect(() => {
    if (tab.isList) {
      // Keep list open if:
      // 1. User clicked on it (selectedTabValue matches)
      // 2. We're on a matching route (isCurrentRoute)
      const shouldBeOpen = tab.key === selectedTabValue || isCurrentRoute;
      setIsListOpen(shouldBeOpen);
    }
  }, [tab.isList, tab.key, selectedTabValue, isCurrentRoute]);

  // Clear selection when navigating to a route that doesn't match this tab
  // Only clear when route actually changes, not on every render
  useEffect(() => {
    const routeChanged = prevPathRef.current !== currentPath;
    prevPathRef.current = currentPath;

    if (routeChanged && !isCurrentRoute && tab.key === selectedTabValue) {
      // Route changed and we're not on a matching route, clear selection
      setSelectedTabValue("");
    }
  }, [
    currentPath,
    isCurrentRoute,
    tab.key,
    selectedTabValue,
    setSelectedTabValue,
  ]);

  // Update selected tab value based on current route
  // Only auto-update based on route, don't clear manual selections immediately
  useEffect(() => {
    if (isCurrentRoute) {
      // If we're on this tab's route, set it as selected
      setSelectedTabValue(tab.key || "");
    }
    // Don't clear selection here - let it persist for manual clicks
    // It will be cleared when navigating to a different route that matches another tab
  }, [currentPath, isCurrentRoute, tab.key, setSelectedTabValue]);

  const handleOpenInNewTab = useCallback(
    (path: string | undefined, e: React.MouseEvent) => {
      if (e.button === 1 && path) {
        window.open(path, "_blank");
      }
    },
    []
  );

  return (
    <>
      {tab.isList ? (
        <>
          <StyledMenuItem
            $isSelected={isSelected}
            $isListOpen={isListOpen}
            $isClosed={isSidebarClosed}
            onClick={onClickTab}
            onMouseDown={(e) => handleOpenInNewTab(tab.path, e)}
          >
            <div style={classes.menuItemContent}>
              <div style={classes.iconContainer}>{iconToRender}</div>
              {!isSidebarClosed && (
                <div style={classes.label}>{t(tab.title)}</div>
              )}
            </div>
            {isSelected && (
              <div style={classes.highlight}>
                <div style={classes.highlightInner} />
              </div>
            )}
          </StyledMenuItem>
          <Collapse in={isListOpen && !isSidebarClosed}>
            {!isSidebarClosed &&
              tab.list
                ?.filter((x) => !x.Permission || CheckPermission(x.Permission))
                .map((list: any) => {
                  return (
                    <StyledSubMenuItem
                      href={list?.path}
                      rel="noreferrer"
                      key={list?.key}
                      $isRTL={t("direction") === "rtl"}
                      $isClosed={isSidebarClosed}
                    >
                      <div
                        onClick={() => changeRoute(list?.path)}
                        onMouseDown={(e) => handleOpenInNewTab(list?.path, e)}
                        style={classes.subMenuLabel}
                      >
                        {t(list?.title)}
                      </div>
                    </StyledSubMenuItem>
                  );
                })}
          </Collapse>
        </>
      ) : (
        <Link
          href={tab.path || "#"}
          rel="noreferrer"
          style={classes.menuItemLink}
        >
          <StyledMenuItem
            $isSelected={isSelected}
            $isClosed={isSidebarClosed}
            onClick={onClickTab}
            onMouseDown={(e) => handleOpenInNewTab(tab.path, e)}
          >
            <div style={classes.menuItemContent}>
              <div style={classes.iconContainer}>{iconToRender}</div>
              {!isSidebarClosed && (
                <div style={classes.label}>{t(tab.title)}</div>
              )}
            </div>
            {isSelected && (
              <div style={classes.highlight}>
                <div style={classes.highlightInner} />
              </div>
            )}
          </StyledMenuItem>
        </Link>
      )}
    </>
  );
};

export { HpTab };
