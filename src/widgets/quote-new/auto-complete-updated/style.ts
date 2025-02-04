import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = ({ isUnderLine }) => {
  const { grayColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      inputMainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6,
        height: 28,
      },
      labelStyle: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: grayColor(500),
      },
      inputTextStyle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: grayColor(900),
        lineHeight: "20px",
        border: "none",
        cursor: "pointer",
        borderRadius: 4,
        padding: "4px 6px",
        width: "fit-content",
        textDecoration: isUnderLine ? "underline" : "none",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
