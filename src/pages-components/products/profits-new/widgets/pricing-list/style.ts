import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH } from "@/utils/adapter";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { neutralColor, secondColor, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        width: "100%",
        paddingTop: 20,
        paddingBottom: 20,
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.08)",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        height: "100%",
        overflow: "Scroll",
      },
      header: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
      },
      row: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        maxHeight: 160,
        overflow: "scroll",
        paddingTop: 10,
      },
      tableBody: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "center",
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
        ...FONT_FAMILY.Lexend(500, 22),
        marginTop: 24.89,
        marginBottom: 24.89,
      },
      line: {
        borderBottom: `0.4px solid ${neutralColor(400)}`,
        width: "100%",
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
      pricListWidgetMainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 16,
      },
      headerMainCointaner: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 40,
      },
      listTitle: {
        width: 275,
        height: 25,
        ...FONT_FAMILY.Lexend(700, 20),
        fontStyle: "normal",
        lineHeight: "25px",
        display: "flex",
        alignItems: "center",
        textalign: "center",
        color: primaryColor(500),
      },
      filtersCointaner: {
        display: "flex",
        gap: 20,
      },
      addNewQuantity: {
        width: "fit-content",
        ...FONT_FAMILY.Lexend(500, 14),
        fontStyle: "normal",
        lineHeight: "18px",
        letterSpacing: "-0.01em",
        color: primaryColor(500),
        testalign: "start",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 7,
        marginLeft: 13.33,
        cursor: "pointer",
      },
      autoCompleteContainer: {
        width: 180,
      },
      tableRowStyle: {
        height: 40,
        background: "#FFFF",
        color: "white",
      },
      tableHeaderStyle: {
        color: "#B5B7C0",
        textAlign: "center" as "center",
        backgroundColor: "inherit",
        ...FONT_FAMILY.Inter(500, 14),
        borderBottom: "none",
      },
      tableHeaderStyle2: {
        color: "#2E3092",
        textAlign: "center" as "center",
        backgroundColor: "inherit",
        ...FONT_FAMILY.Inter(500, 14),
        borderBottom: "none",
      },
      cellContainerStyle: {
        textAlign: "center" as "center",
        color: "#090A1D",
        ...FONT_FAMILY.Lexend(400, 14),
      },
      cellTextInputStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      autoCompleteStyleContainer: {
        height: 25,
        borderRadius: 0,
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#F135A3",
        borderBottom: "none",
      },
      chartContainer: {
        maxHeight: 300,
        minWidth: "100%",
        width: "100%",
      },
      menuItemStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: primaryColor(300),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
