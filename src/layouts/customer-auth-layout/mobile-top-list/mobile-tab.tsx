import { Collapse, Stack } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useGomakeRouter } from "@/hooks";
import { useRecoilState } from "recoil";
import { selectedTabState } from "@/store";
import { useTranslation } from "react-i18next";
import { useUserPermission } from "@/hooks/use-permission";
import { ArrowDownIcon } from "@/icons/side-list-icons/arrows";
import { convertWidthToVW } from "@/utils/adapter";
import Link from "next/link";
import { useStyle } from "./style";

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
}
const Tab = ({ tab }: IProps) => {
  const [selectedTabValue, setSelectedTabValue] =
    useRecoilState(selectedTabState);
  const { navigate } = useGomakeRouter();
  const [isListOpen, setIsListOpen] = useState(tab?.key === selectedTabValue);
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { CheckPermission } = useUserPermission();
  const { classes } = useStyle();

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
        onClick={onClickTab}
        onMouseDown={(e) => handleOpenInNewTab(tab.path, e)}
      >
        {/* Conditional rendering of Stack or a element */}
        {tab.isList ? (
          <Stack
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Stack direction={"row"} sx={{ gap: "10px" }}>
              <div>{tab && tab?.icon()}</div>
              <div style={classes.tabTitle}>{t(tab.title)}</div>
            </Stack>
            <div>
              {isListOpen ? (
                <div style={isRTL ? classes.rotate90Rtl : classes.rotate90}>
                  <ArrowDownIcon />
                </div>
              ) : (
                <ArrowDownIcon />
              )}
            </div>
          </Stack>
        ) : (
          <Link
            href={tab.path}
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              textDecoration: "none",
            }}
          >
            <Stack direction={"row"} sx={{ gap: "10px" }}>
              <div>{tab && tab?.icon()}</div>
              <div style={classes.tabTitle}>{t(tab.title)}</div>
            </Stack>
            <div style={{ marginLeft: 5 }} />
          </Link>
        )}
      </div>
      <Collapse in={isListOpen}>
        {tab.list
          ?.filter((x) => !x.Permission || CheckPermission(x.Permission))
          .map((list: any) => {
            return (
              <Link
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
              </Link>
            );
          })}
      </Collapse>
    </>
  );
};

export { Tab };
