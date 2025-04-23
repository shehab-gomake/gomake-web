import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      buttonLabel: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "rgba(52, 64, 84, 1)",
      },
      listItemButton: {
        minWidth: "163px",
        height: "36px",
        borderRadius: "8px",
        border: "1px solid rgba(208, 213, 221, 1)",
        backgroundColor: "#FFF",
        ...FONT_FAMILY.Lexend(500, 16),
        cursor: "pointer" as "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        textTransform: "none" as "none",
        boxShadow: "none" as "none",
        padding: "0 8px",
      },
      boxStyle: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
