import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useIsMobile, useMobileHeight } from "@/hooks/use-responsive";
import {
  adaptRight,
  convertHeightToVH,
  convertWidthToVW,
} from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import {
  HEADER_HEIGHT,
  LAYOUT_DEFAULT_GAP,
  SIDE_MENU_Layout,
} from "@/utils/layout-config";
import { useMemo } from "react";
import { useTheme } from "@/contexts/theme";
import { useRouter } from "next/router";

const useStyle = ({
  isHover = false,
  navStatus,
  customGap,
}: {
  isHover?: boolean;
  navStatus: any;
  customGap?: number;
}) => {
  const { theme, primaryColor, primarySecondaryBlend } = useGomakeTheme();
  const isMobile = useIsMobile();
  const mobileHeight = useMobileHeight();
  const { currentTheme } = useTheme();
  const router = useRouter();
  const isHpClient = currentTheme === "hp-client";
  const isSettingsPage = router.pathname?.startsWith("/settings");

  const classes = useMemo(() => {
    return {
      container: {
        width: "100%",
        display: "flex",
        flexDirection: "row" as "row",
        backgroundColor: "var(--theme-bg-body, #f6f6f6)",
      },
      logoContainer: {
        display: "flex",
        marginTop: navStatus?.isClosed ? 20 : 0,
        backgroundColor: primarySecondaryBlend(700),
        borderRadius: 8,
        padding: 10,
      },
      leftContainer: {
        backgroundColor: primaryColor(500),
        width: navStatus?.isClosed ? 125 : 245,
        minWidth: navStatus?.isClosed ? 125 : 260,
        transitionDuration: "0.4s",
        height: isMobile ? "auto" : "100vh",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start" as "flex-start",
        alignItems: "center",
        paddingRight: navStatus?.isClosed ? 5 : 26,
        paddingLeft: navStatus?.isClosed ? 5 : 26,
        paddingTop: navStatus?.isClosed ? 8 : 40,
        paddingBottom: navStatus?.isClosed ? 8 : 40,
        overflowY: "scroll" as "scroll",
        position: "relative" as "relative",
        zIndex: 1,
      },
      rightContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        height: isMobile ? mobileHeight : "100vh",
        maxHeight: "100vh",
        overflow: "scroll",
      },
      headerContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#F6F6F6",
      },
      bodyContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        backgroundColor: "var(--theme-bg-body, #F6F6F6)",
        height: "100%",
        // overflow: "scroll",
        overflow: "auto",
        marginTop: isHpClient && !isSettingsPage ? 20 : 0,
      },
      poweredContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: navStatus?.isClosed ? "center" : "flex-start",
        alignItems: navStatus?.isClosed ? "center" : "flex-start",
        marginTop: "10px",
        marginBottom: navStatus?.isClosed ? "10px" : "10px",
        gap: "7px",
        width: "100%",
      },
      poweredByLbl: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: "#FFF",
      },
      goMakeByLbl: {
        ...FONT_FAMILY.Lexend(400, 28),
        color: "#FFF",
      },
      tabsContainer: {
        alignSelf: "flex-start",
        width: "100%",
        // height: "100%",
        marginTop: "10px",
      },
      lastTabsContainer: {
        alignSelf: "flex-start",
        width: "100%",
      },
      tabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: navStatus?.isClosed ? "center" : "flex-start",
        alignItems: "center",
        gap: convertWidthToVW(8),
        marginTop: convertHeightToVH(24),
        cursor: "pointer",
        opacity: isHover ? 0.5 : 1,
      },
      tabTitle: {
        ...FONT_FAMILY.Inter(400, 16),
        color: "#FFF",
        cursor: "pointer",
        minWidth: "fit-content",
        lineHeight: "24px",
        letterSpacing: "0.04em",
      },
      line: {
        border: "1px solid #FFFFFF19",
        width: navStatus?.isClosed ? "70%" : "98%",
        marginTop: convertHeightToVH(24),
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        alignSelf: "stretch",
      },
      lineContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
      },
      tabList: {
        paddingTop: convertWidthToVW(15),
        paddingLeft: convertWidthToVW(25),
        paddingRight: convertWidthToVW(25),
        display: "flex",
        textDecoration: "none",
      },
      rotate90: {
        "-webkit-animation": "rotate90 0.5s forwards",
        "-moz-animation": "rotate90 0.5s forwards",
        animation: "rotate90 0.5s forwards",
      },
      rotate90Rtl: {
        "-webkit-animation": "rotate90-rtl 0.5s forwards",
        "-moz-animation": "rotate90-rtl 0.5s forwards",
        animation: "rotate90-rtl 0.5s forwards",
      },
      mobileHeaderContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "5px 10px",
        height: convertHeightToVH(HEADER_HEIGHT),
        maxHeight: convertHeightToVH(HEADER_HEIGHT),
        backgroundColor: primaryColor(500),
      },
    };
  }, [
    isHover,
    navStatus,
    isMobile,
    mobileHeight,
    theme,
    isHpClient,
    isSettingsPage,
    router.pathname,
  ]);
  return {
    classes,
  };
};
export { useStyle };
