import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({
  isHover = false,
  navStatus,
}: {
  isHover?: boolean;
  navStatus: any;
}) => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row" as "row",
        backgroundColor: "#FFFFFF",
      },
      logoContainer: {
        display: "flex",
        marginTop: navStatus?.isClosed ? 20 : 0,
      },
      leftContainer: {
        backgroundColor: primaryColor(500),
        width: navStatus?.isClosed ? 140 : 280,
        minWidth: navStatus?.isClosed ? 140 : 280,
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between" as "space-between",
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
        // backgroundColor: "#FDFDFD",
        width: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        padding: convertWidthToVW(20),
        overflowY: "scroll" as "scroll",
        backgroundColor: "#FFFFFF",
      },
      headerContainer: {
        height: convertHeightToVH(101),
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#FFFFFF",
      },
      bodyContainer: {
        height: convertHeightToVH(1024 - 101),
        display: "flex",
        flexDirection: "column" as "column",
        backgroundColor: "#FFFFFF",
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

      ///Tab
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
        marginTop: convertHeightToVH(24),
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
    clasess,
  };
};
export { useStyle };
