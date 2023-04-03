import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({ isHover = false }: { isHover?: boolean }) => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row" as "row",
      },
      logoContainer: {
        display: "flex",
      },
      leftContainer: {
        backgroundColor: primaryColor(500),
        width: convertWidthToVW(281),
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between" as "space-between",
        alignItems: "center",
        paddingRight: convertWidthToVW(26),
        paddingLeft: convertWidthToVW(26),
        paddingTop: convertHeightToVH(40),
        paddingBottom: convertHeightToVH(40),
        overflowY: "scroll" as "scroll",
      },
      rightContainer: {
        backgroundColor: "#FDFDFD",
        width: convertWidthToVW(1468 - 281),
        display: "flex",
        flexDirection: "column" as "column",
        padding: convertWidthToVW(20),
        overflowY: "scroll" as "scroll"
      },
      headerContainer: {
        height: convertHeightToVH(101),
        display: "flex",
        flexDirection: "column" as "column",
      },
      bodyContainer: {
        height: convertHeightToVH(1024 - 101),
        display: "flex",
        flexDirection: "column" as "column",
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
        // height: "100%",
        marginTop: convertHeightToVH(46),
      },
      tabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start" as "flex-start",
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
        width: convertWidthToVW(207),
        marginTop: convertHeightToVH(28),
        marginBottom: convertHeightToVH(32),
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
  }, [isHover]);
  return {
    clasess,
  };
};
export { useStyle };
