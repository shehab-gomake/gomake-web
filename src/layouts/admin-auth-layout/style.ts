import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({
  isHover = false,
  navStatus = false,
}: {
  isHover?: boolean | undefined;
  navStatus?: any;
}) => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "row" as "row",
      },
      logoContainer: {
        display: "flex",
        ...FONT_FAMILY.Lexend(700, 18),
        color: "white",
        marginTop: navStatus?.isClosed ? 20 : 0,
      },
      leftContainer: {
        backgroundColor: primaryColor(500),
        width: navStatus?.isClosed ? 140 : 280,
        minWidth: navStatus?.isClosed ? 140 : 280,
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: navStatus?.isClosed
          ? convertWidthToVW(5)
          : convertWidthToVW(26),
        paddingLeft: navStatus?.isClosed
          ? convertWidthToVW(5)
          : convertWidthToVW(26),
        paddingTop: navStatus?.isClosed
          ? convertHeightToVH(8)
          : convertWidthToVW(40),
        paddingBottom: navStatus?.isClosed
          ? convertHeightToVH(8)
          : convertWidthToVW(40),
        overflowY: "scroll" as "scroll",
      },
      rightContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        padding: 20,
        paddingTop: 7,
        // overflowY: "scroll" as "scroll",
        backgroundColor: "#FFFFFF",
      },
      headerContainer: {
        height: convertHeightToVH(101),
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      },
      bodyContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        overflowY: "scroll" as "scroll",
      },
      poweredContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 53,
      },
      poweredByLbl: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: "#FFF",
      },
      gomakeByLbl: {
        ...FONT_FAMILY.Lexend(400, 28),
        color: "#FFF",
      },
      tabsContainer: {
        alignSelf: "flex-start",
        height: "100%",
        width: "100%",
        marginTop: convertHeightToVH(46),
        overflow: "scroll" as "scroll",
      },
      tabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: navStatus?.isClosed ? "center" : "flex-start",
        alignItems: "center",
        gap: convertWidthToVW(8),
        marginTop: convertHeightToVH(28),
        cursor: "pointer",
        opacity: isHover ? 0.5 : 1,
      },
      tabTitle: {
        ...FONT_FAMILY.Inter(400, 16),
        color: "#FFF",
        cursor: "pointer",
      },
      line: {
        border: "1px solid #FFFFFF",
        opacity: 0.4,
        width: "90%",
        marginTop: convertHeightToVH(28),
        marginBottom: convertHeightToVH(32),
        alignSelf: "center",
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
        paddingLeft: convertWidthToVW(40),
        paddingRight: convertWidthToVW(40),
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
