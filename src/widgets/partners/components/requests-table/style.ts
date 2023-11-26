import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      acceptedStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "83px",
        height: "22px",
        padding: "2px, 12px, 2px, 12px",
        borderRadius: "17px",
        color: "#28C76F",
        background: "#28C76F1F",
        ...FONT_FAMILY.Lexend(600, 12),
      },
      pendingStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "83px",
        height: "22px",
        padding: "2px, 12px, 2px, 12px",
        borderRadius: "17px",
        color: "#898989",
        background: "#1E1E1E1F",
        ...FONT_FAMILY.Lexend(600, 12),
      },
      tableStyle: {
        border: "1px dotted #c9c8c3",
        borderRadius: 4,
        width: "92%",
        boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
      },

    headersStyle: {
        color: primaryColor(800),
        ...FONT_FAMILY.Lexend(500, 14),
        letterSpacing: '-1%',
        lineHeight: "17.5px",
    },
    dataRowStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        lineHeight: "17.5px",
        color: primaryColor(500),
        letterSpacing: '-1%',
    }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
