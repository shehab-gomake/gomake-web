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
        alignItems: "center",
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
        height:20
      },
      plusIconContainer: {
        cursor: "pointer",
        width:16,
        height:20
      },
      labelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
        height: 20,
      },
      addBtnStyle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(900),
        cursor: "pointer",
      },

      textInputStyle: {
        background: "#FFFFFF",
        filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08))",
        // boxShadow: "0px 4px 60px rgba(0, 0, 0, 0.08)",
        borderRadius: 4,
        border: "1px solid #FFFFFF",
        height: 40,
        width: "100%",
      },
      autoComplateStyle: {
        background: "#FFFFFF",
        filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08))",
        // boxShadow: "0px 4px 60px rgba(0, 0, 0, 0.08)",
        borderRadius: 4,
        border: "1px solid #FFFFFF",
        height: 40,
        width: "100%",
      },
      addContactContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
      },
      addDeleteContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      },
      addContactStyle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(900),
      },
      removeContactStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: "#D92C2C",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
