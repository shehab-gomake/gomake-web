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
        gap: 24,
        marginBottom: 4,
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
        color: primaryColor(700),
        padding: "8px 14px",
        cursor: "pointer",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
