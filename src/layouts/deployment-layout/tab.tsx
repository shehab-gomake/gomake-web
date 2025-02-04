import { TabCloseIcon } from "@/icons";
import { Collapse } from "@mui/material";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-admin-auth-layout-hook";
import { useGomakeRouter } from "@/hooks";
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
  const [isListOpen, setIsListOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const { clasess } = useStyle({ isHover });
  const { t } = useTranslation();
  const { navigate } = useGomakeRouter();
  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const onClickTab = useCallback(
    (route: string) => {
      if (tab.isList) {
        setIsListOpen(!isListOpen);
      } else {
        navigate(route);
      }
    },
    [tab, isListOpen, setIsListOpen]
  );
  const changeRoute = useCallback((route: string) => {
    navigate(route);
  }, []);
  return (
    <>
      <div
        style={clasess.tabContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClickTab(tab.path)}
      >
        {tab.isList && (
          <div>
            {isListOpen ? (
              <div style={clasess.rotate90}>
                <TabCloseIcon />
              </div>
            ) : (
              <TabCloseIcon />
            )}
          </div>
        )}
        <div>{tab.icon()}</div>
        <div style={clasess.tabTitle}>{tab.title}</div>
      </div>
      <Collapse in={isListOpen}>
        {tab.list?.map((list: any) => {
          return (
            <div style={clasess.tabList} key={list.key}>
              <div
                onClick={() => changeRoute(list?.path)}
                style={clasess.tabTitle}
              >
                {list.title}
              </div>
            </div>
          );
        })}
      </Collapse>
    </>
  );
};

export { Tab };
