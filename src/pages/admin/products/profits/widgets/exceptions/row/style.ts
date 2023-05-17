import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor, secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      bodyRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
      },
      rowItem: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(900),
        textalign: "center",
        // width: `${width}`,
      },
      scopeRowItem: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(900),
        textalign: "center",
        width: "25.8%",
      },
      autoComplateStyle: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        // width: `${width}`,
        border: "1px solid red",
        backgroundColor: "#FFFFFF",
        color: secondColor(400),
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.08)",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
