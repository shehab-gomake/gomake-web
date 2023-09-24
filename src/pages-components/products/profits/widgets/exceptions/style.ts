import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH } from "@/utils/adapter";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { neutralColor, secondColor, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        height: "100%",
      },
      header: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        // marginBottom: 36,
        paddingLeft: 22,
        paddingRight: 22,
      },
      tableBody: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        alignitems: "flex-start",
        height: 360,
        overflow: "scroll",
        // backgroundColor: "red",
      },
      skeletonRowStyle: {
        marginTop: convertHeightToVH(10),
      },
      noDataContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        color: secondColor(500),
        // height: 200,
        // lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 22),
      },
      line: {
        borderBottom: `0.4px solid ${neutralColor(600)}`,
      },
      filterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContainer: "flex-start",
        alignItems: "center",
        justifyContent: "space-around",
      },
      autoComplateStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 160,
        border: "1px solid #FFFFFF",
        backgroundColor: "#FFFFFF",
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 0,
        paddingLeft: 0,
        color: secondColor(400),
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.08)",
      },
      headerMainCointaner: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column" as "column",
      },
      listTitle: {
        width: 275,
        ...FONT_FAMILY.Lexend(700, 20),
        fontStyle: "normal",
        display: "flex",
        alignItems: "center",
        textalign: "center",
        color: primaryColor(500),
        marginBottom: 16,
        height: 40,
      },
      filtersCointaner: {
        display: "flex",
        gap: 20,
      },
      minCointaner: {
        width: "100%",
        ...FONT_FAMILY.Lexend(400, 14),
        fontStyle: "normal",
        color: secondColor(500),
        marginBottom: 24,
        testalign: "center",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 15,
        gap: 15,
        paddingLeft: 22,
        paddingRight: 22,
      },
      textInputStyle: {
        width: 120,
        height: 40,
      },
      addNewException: {
        width: "fit-content",
        ...FONT_FAMILY.Lexend(500, 14),
        fontStyle: "normal",
        letterSpacing: "-0.01em",
        color: primaryColor(500),
        testalign: "start",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 7,
        cursor: "pointer",
        paddingLeft: 22,
        paddingRight: 22,
      },
      withoutTitle: {
        paddingTop: 20,
        paddingBottom: 20,
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
      },
      rowHeader: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: neutralColor(400),
        textAlign: "center" as "center",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
