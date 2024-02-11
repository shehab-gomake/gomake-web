import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = () => {
  const classes = useMemo(() => {
    return {
      tableFooterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        boxShadow: " 0px 1px 3px 0px #1018281A",
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
      },
      firstRowForFooterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
      },
      evenRowContainer: {
        display: "flex",
        textAlign: "center" as "center",
        padding: "12px 24px",
        color: "#FFFF",
        background: "#8283BE",
        ...FONT_FAMILY.Inter(500, 12),
        height: 44,
        borderBottom: "1px solid #EAECF0",
      },
      oddRowContainer: {
        display: "flex",
        padding: "12px 24px",
        background: "#FFFFFFF",
        ...FONT_FAMILY.Inter(400, 14),
        height: 44,
        borderBottom: "1px solid #EAECF0",
      },
      cellTextInputStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
