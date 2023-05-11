import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({ width }: any) => {
  const { primaryColor } = useGomakeTheme();
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
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(900),
        textalign: "center",
        paddingTop: 18,
        paddingBottom: 18,
        paddingLeft: 22,
        paddingRight: 22,
        width: `${width}`,
      },
      editItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(300),
        textalign: "center",
        paddingTop: 18,
        paddingBottom: 18,
        paddingLeft: 22,
        paddingRight: 22,
        width: `${width}`,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
