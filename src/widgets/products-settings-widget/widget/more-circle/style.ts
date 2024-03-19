import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, errorColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: { width: "85%" },
      menuItemContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        padding: 15,
      },
      menuTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(300),
      },
      lineStyle: {
        width: "100%",
        height: 1,
        backgroundColor: "#EEEEEE",
      },
      menuRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: 3,
      },
      rowTextStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: "rgba(130, 131, 190, 1)",
      },
      errorMsgStyle: {
        padding: 10,
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
