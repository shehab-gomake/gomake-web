import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({ width }: any) => {
  const { primaryColor, secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      bodyRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
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
        width: `${width}`,
      },
      autoComplateStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${width}`,
        border: "1px solid #FFFFFF",
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
