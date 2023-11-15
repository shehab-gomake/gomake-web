import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 24,
        marginTop: 16,
      },
      fieldContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "15%",
      },
      labelContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16,
      },
      labelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
      },
      plusIconContainer: {
        cursor: "pointer",
        width: 16,
        height: 16,
      },
      textInputStyle: {
        background: "#FFFFFF",
        filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08))",
        borderRadius: 4,
        border: "1px solid #FFFFFF",
        height: 40,
        width: "100%",
        ...FONT_FAMILY.Lexend(500,14)
      },
      autoComplateStyle: {
        background: "#FFFFFF",
        filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08))",
        borderRadius: 4,
        border: "1px solid #FFFFFF",
        height: 40,
        width: "100%",
        ...FONT_FAMILY.Lexend(500,14)
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
