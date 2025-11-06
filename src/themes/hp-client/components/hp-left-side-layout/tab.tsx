import { useCallback, useEffect, useState } from "react";
import { useStyle } from "./tab.style";
import { useGomakeRouter } from "@/hooks";
import { useRecoilState } from "recoil";
import { selectedTabState } from "@/store";
import { useTranslation } from "react-i18next";
import { useUserPermission } from "@/hooks/use-permission";
import Link from "next/link";
import { Collapse } from "@mui/material";
import { getHpIcon } from "./icons";

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
  const [selectedTabValue, setSelectedTabValue] =
    useRecoilState(selectedTabState);
  const { navigate } = useGomakeRouter();
  const [isListOpen, setIsListOpen] = useState(tab?.key === selectedTabValue);
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const isSelected = tab.key === selectedTabValue;
  const { classes } = useStyle({
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
      setIsListOpen(!isListOpen);
    } else {
      changeRoute(tab.path);
    }
    setSelectedTabValue(tab.key || "");
  }, [tab, isListOpen, setIsListOpen]);

  const changeRoute = useCallback((route: string) => {
    navigate(route);
  }, []);

  useEffect(() => {
    if (tab.key === selectedTabValue) {
      setIsListOpen(true);
    }
  }, [selectedTabValue]);

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
          <div
            style={classes.menuItem}
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
          </div>
          <Collapse in={isListOpen && !isSidebarClosed}>
            {!isSidebarClosed &&
              tab.list
                ?.filter((x) => !x.Permission || CheckPermission(x.Permission))
                .map((list: any) => {
                  return (
                    <Link
                      href={list?.path}
                      rel="noreferrer"
                      style={classes.subMenuItem}
                      key={list?.key}
                    >
                      <div
                        onClick={() => changeRoute(list?.path)}
                        onMouseDown={(e) => handleOpenInNewTab(list?.path, e)}
                        style={classes.subMenuLabel}
                      >
                        {t(list?.title)}
                      </div>
                    </Link>
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
          <div
            style={classes.menuItem}
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
          </div>
        </Link>
      )}
    </>
  );
};

export { HpTab };
