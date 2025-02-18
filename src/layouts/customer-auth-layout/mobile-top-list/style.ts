import { useGomakeTheme } from "@/hooks/use-gomake-thme";
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

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "row" as "row",
        // gap: customGap ? LAYOUT_DEFAULT_GAP : 0,
        backgroundColor: "#F6F6F6",
      },
      logoContainer: {
        display: "flex",
        marginTop: 0,
        backgroundColor: "#504FA1",
        borderRadius: 8,
        padding: 10,
      },
      leftContainer: {
        backgroundColor: primaryColor(500),
        width: "100%",
        minWidth: 245,
        transitionDuration: "0.4s",
        height: "100vh",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start" as "flex-start",
        alignItems: "center",
        paddingBottom: 10,
        padding: "0px 26px",
        overflowY: "scroll" as "scroll",
        position: "relative" as "relative",
        zIndex: 1,
      },

      rightContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        height: "100vh",
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
        backgroundColor: "#F6F6F6",
        height: "100%",

        overflow: "scroll",
      },
      poweredContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: "10px",
        marginBottom: "10px",
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
        marginTop: "10px",
      },
      lastTabsContainer: {
        alignSelf: "flex-start",
        width: "100%",
      },
      tabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: convertWidthToVW(8),
        marginTop: convertHeightToVH(24),
        cursor: "pointer",
        opacity: 1,
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
        width: "98%",
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
        padding: "5px 10px",
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
  }, []);
  return {
    classes,
  };
};
export { useStyle };
