import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = ({ width, header }: any) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      headerItem: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        color: neutralColor(400),
        width: `${width}`,
        textalign: "center",
        ...FONT_FAMILY.Lexend(400, 16),
        fontStyle: "normal",
        lineHeight: "20px",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
