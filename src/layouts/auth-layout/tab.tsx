import { TabCloseIcon } from "@/icons";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
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
  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const onClickTab = useCallback(() => {
    if (tab.isList) {
      console.log("Here");
      setIsListOpen(true);
    }
  }, [tab, isListOpen]);

  return (
    <div
      style={clasess.tabContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClickTab}
    >
      {tab.isList && (
        <div>{isListOpen ? <TabCloseIcon /> : <TabCloseIcon />}</div>
      )}
      <div>{tab.icon()}</div>
      <div style={clasess.tabTitle}>{tab.title}</div>
      {isListOpen &&
        tab.list?.map((list: any) => {
          return (
            <div style={clasess.tabList} key={list.key}>
              <div style={clasess.tabListTitle}>{list.title}</div>
            </div>
          );
        })}
    </div>
  );
};

export { Tab };
