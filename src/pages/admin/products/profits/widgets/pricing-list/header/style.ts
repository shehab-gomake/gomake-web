import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = ({ width, header }: any) => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      headerItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color:
          header == "Exp.meter"
            ? primaryColor(500)
            : header == "Total price"
            ? primaryColor(500)
            : "#B5B7C0",
        width: `${width}`,
        textalign: "center",

        ...FONT_FAMILY.Lexend(
          header == "Exp.meter" ? 600 : header == "Total price" ? 600 : 500,
          14
        ),
        fontStyle: "normal",
        lineHeight: "18px",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
