import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      businessContainerStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        marginBottom: 14,
        gap: 24,
      },

      addNewContactNameStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
      },
      addNewContactNameTextStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        lignHeight: 20,
        color: secondColor(500),
      },
      addDeleteContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      },
      addContactContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
      },
      removeContactStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: "#D92C2C",
      },
      showLessContainer: {
        ...FONT_FAMILY.Inter(600, 14),
        color: primaryColor(500),
        padding: "8px 14px",
        cursor: "pointer",
        minWidth: 104,
      },
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
      },
      saveBtnStyle: {
        borderRadius: 4,
        padding: "4px 10px",
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#FFFFFF",
        backgroundColor: secondColor(500),
        height: 28,
        width: 60,
        minWidth:"fit-content"
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
