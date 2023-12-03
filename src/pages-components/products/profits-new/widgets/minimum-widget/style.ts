import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      headerTableContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",
        borderRadius: "16px",
        backgroundColor: "#D5D6E9",
      },
      headerTitleStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 11,
      },
      titleStyle: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: "#202020",
      },
      lineStyle: {
        height: 25,
        width: 1,
        backgroundColor: "#FFFFFF",
      },
      valueTextStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#667085",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
