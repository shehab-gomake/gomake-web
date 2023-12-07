import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 11,
      },
      cardItemWithMore: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",
        backgroundColor: "#F8FAFB",
        marginBottom: 6,
        borderRadius: 16,
        cursor: "pointer",
        gap: 5,
      },
      WithBordermainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",
        backgroundColor: "#F8FAFB",
        marginBottom: 6,
        borderRadius: 16,
        border: "2px solid  #504FA1",
        cursor: "pointer",
        gap: 5,
      },
      emptyStyle: { width: 14, height: 24 },
      sortStyle: { cursor: "pointer" },
      moreIconStyle: {
        cursor: "pointer",
        display: "flex",
      },
      firstRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 15,
        width: "100%",
      },
      ruleTextStyle: {
        color: "#667085",
        ...FONT_FAMILY.Inter(500, 14),
        width: "5%",
      },
      lineStyle: {
        height: 25,
        width: 1,
        backgroundColor: "#D0D5DD",
      },
      valueStyle: {
        color: "#344054",
        ...FONT_FAMILY.Inter(600, 14),
        width: "10%",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
