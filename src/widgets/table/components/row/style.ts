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
      secondRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        height: 60,
        backgroundColor: "#F6F6F6",
      },
      rowItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 12),
        lineHeight: "12px",
        color: primaryColor(500),
        textalign: "center",
        paddingTop: 14,
        paddingBottom: 14,
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
