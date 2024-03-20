import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { LAYOUT_DEFAULT_GAP, SIDE_MENU_Layout } from "@/utils/layout-config";
import { useMemo } from "react";

const useStyle = ({
  isHover = false,
  navStatus,
  customGap,
}: {
  isHover?: boolean;
  navStatus: any;
  customGap: number;
}) => {
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
        marginTop: navStatus?.isClosed ? 20 : 0,
        backgroundColor: "#504FA1",
        borderRadius: 8,
        padding: 10,
      },
      leftContainer: {
        backgroundColor: primaryColor(500),
        width: navStatus?.isClosed ? 125 : 245,
        minWidth: navStatus?.isClosed ? 125 : 245,
        transitionDuration: "0.4s",
        height: "100vh",
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
        zIndex: SIDE_MENU_Layout,
      },
      rightContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
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
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
      },
      poweredByLbl: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: "#FFF",
      },
      gomakeByLbl: {
        ...FONT_FAMILY.Lexend(400, 28),
        color: "#FFF",
      },

      ///Tab
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
      },
      line: {
        border: "1px solid #FFFFFF",
        opacity: 0.4,
        width: "90%",
        marginTop: convertHeightToVH(24),
        // marginBottom: convertHeightToVH(32),
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
      },
      rotate90: {
        "-webkit-animation": "rotate90 0.5s forwards ",
        "-moz-animation": "rotate90 0.5s forwards ",
        animation: "rotate90 0.5s forwards ",
      },
    };
  }, [isHover, navStatus]);
  return {
    classes,
  };
};
export { useStyle };
