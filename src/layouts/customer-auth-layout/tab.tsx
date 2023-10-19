import { TabCloseIcon } from "@/icons";
import { Collapse } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useStyle } from "./style";
import { useGomakeRouter } from "@/hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedTabState } from "@/store";
import { navStatusState } from "@/store/nav-status";
import { useTranslation } from "react-i18next";
interface IProps {
  tab: {
    isLine?: boolean;
    key?: string;
    title?: string;
    path?: string;
    isList?: boolean;
    icon?: any;
    list?: any[];
  };
}
const Tab = ({ tab }: IProps) => {
  const [selectedTabValue, setSelectedTabValue] =
    useRecoilState(selectedTabState);
  const { navigate } = useGomakeRouter();
  const [isListOpen, setIsListOpen] = useState(tab?.key === selectedTabValue);
  const [isHover, setIsHover] = useState(false);
  const navStatus = useRecoilValue(navStatusState);
  const { t } = useTranslation();
  const { clasess } = useStyle({ isHover, navStatus });
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
        style={clasess.tabContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClickTab}
      >
        {tab.isList ? (
          <div>
            {isListOpen ? (
              <div style={clasess.rotate90}>
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
        <div style={clasess.tabTitle}>
          {!navStatus.isClosed ? t(tab.title) : null}
        </div>
      </div>
      <Collapse in={isListOpen}>
        {!navStatus.isClosed &&
          tab.list?.map((list: any) => {
            return (
              <div style={clasess.tabList} key={list?.key}>
                <div
                  onClick={() => changeRoute(list?.path)}
                  style={clasess.tabTitle}
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
