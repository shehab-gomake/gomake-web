import { TabCloseIcon } from "@/icons";
import { Collapse } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useStyle } from "./style";
import { useGomakeRouter } from "@/hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedTabState } from "@/store";
import { navStatusState } from "@/store/nav-status";
import { useTranslation } from "react-i18next";
import {useUserPermission} from "@/hooks/use-permission";
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
  const [selectedTabValue, setSelectedTabValue] =useRecoilState(selectedTabState);
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
  return (
    <>
      <div
        style={classes.tabContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClickTab}
        onMouseDown={(e) => {
          if (e.button === 1) {
            window.open(tab.path, "_blank");
          }
        }}
      >
        {tab.isList ? (
          <div>
            {isListOpen ? (
              <div style={classes.rotate90}>
                <TabCloseIcon />
              </div>
            ) : (
              <TabCloseIcon />
            )}
          </div>
        ) : (
          <div style={{ marginLeft: 5 }} />
        )}
        <div>{tab && tab?.icon()}</div>
        <div style={classes.tabTitle}>
          {!navStatus.isClosed ? t(tab.title) : null}
        </div>
      </div>
      <Collapse in={isListOpen}>
        {!navStatus.isClosed &&
          tab.list?.filter(x=>!x.Permission || CheckPermission(x.Permission)).map((list: any) => {
            return (
              <div style={classes.tabList} key={list?.key}>
                <div
                  onClick={() => changeRoute(list?.path)}
                  onMouseDown={(e) => {
                    if (e.button === 1) {
                      window.open(list?.path, "_blank");
                    }
                  }}
                  style={classes.tabTitle}
                >
                  {t(list?.title)}
                </div>
              </div>
            );
          })}
      </Collapse>
    </>
  );
};

export { Tab };
