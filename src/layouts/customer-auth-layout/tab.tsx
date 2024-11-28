import { Collapse, Stack } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useStyle } from "./style";
import { useGomakeRouter } from "@/hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedTabState } from "@/store";
import { navStatusState } from "@/store/nav-status";
import { useTranslation } from "react-i18next";
import { useUserPermission } from "@/hooks/use-permission";
import { ArrowDownIcon } from "@/icons/side-list-icons/arrows";
import { convertWidthToVW } from "@/utils/adapter";

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
}
const Tab = ({ tab, customGap }: IProps) => {
  const [selectedTabValue, setSelectedTabValue] =
    useRecoilState(selectedTabState);
  const { navigate } = useGomakeRouter();
  const [isListOpen, setIsListOpen] = useState(tab?.key === selectedTabValue);
  const [isHover, setIsHover] = useState(false);
  const navStatus = useRecoilValue(navStatusState);
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const { classes } = useStyle({ isHover, navStatus, customGap });

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

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
      <div
        style={classes.tabContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClickTab}
        onMouseDown={(e) => handleOpenInNewTab(tab.path, e)}
      >
        {/* Conditional rendering of Stack or a element */}
        {tab.isList ? (
          <Stack
            direction={"row"}
            sx={{
              justifyContent: navStatus?.isClosed
                ? "flex-start"
                : "space-between",
              width: navStatus?.isClosed ? "auto" : "100%",
            }}
          >
            <Stack direction={"row"} sx={{ gap: convertWidthToVW(8) }}>
              <div>{tab && tab?.icon()}</div>
              <div style={classes.tabTitle}>
                {!navStatus.isClosed ? t(tab.title) : null}
              </div>
            </Stack>
            <div>
              {isListOpen ? (
                <div style={classes.rotate90}>
                  <ArrowDownIcon />
                </div>
              ) : (
                <ArrowDownIcon />
              )}
            </div>
          </Stack>
        ) : (
          <a
            href={tab.path}
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: navStatus?.isClosed
                ? "flex-start"
                : "space-between",
              width: navStatus?.isClosed ? "auto" : "100%",
              textDecoration: "none",
            }}
          >
            <Stack direction={"row"} sx={{ gap: convertWidthToVW(8) }}>
              <div>{tab && tab?.icon()}</div>
              <div style={classes.tabTitle}>
                {!navStatus.isClosed ? t(tab.title) : null}
              </div>
            </Stack>
            <div style={{ marginLeft: 5 }} />
          </a>
        )}
      </div>
      <Collapse in={isListOpen}>
        {!navStatus.isClosed &&
          tab.list
            ?.filter((x) => !x.Permission || CheckPermission(x.Permission))
            .map((list: any) => {
              return (
                <a
                  href={list?.path}
                  rel="noopener noreferrer"
                  style={classes.tabList}
                  key={list?.key}
                >
                  <div
                    onClick={() => changeRoute(list?.path)}
                    onMouseDown={(e) => handleOpenInNewTab(list?.path, e)}
                    style={classes.tabTitle}
                  >
                    {t(list?.title)}
                  </div>
                </a>
              );
            })}
      </Collapse>
    </>
  );
};

export { Tab };
