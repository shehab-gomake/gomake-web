import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { grayColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      businessContainerStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 24,
        marginBottom: 14,
      },
      autoCompleteStyle: {
        background: "#FFFFFF",
        filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08))",
        borderRadius: 4,
        border: "1px solid #FFFFFF",
        height: 30,
        width: "180px",
        ...FONT_FAMILY.Lexend(500,14)
      },
      labelStyle: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: grayColor(500),
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
