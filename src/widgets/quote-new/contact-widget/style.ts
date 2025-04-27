import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      businessContainerStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        marginBottom: 14,
        gap: 20,
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

      saveBtnStyle: {
        borderRadius: 4,
        padding: "4px 10px",
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#FFFFFF",
        backgroundColor: secondColor(500),
        height: 28,
        width: 60,
        minWidth: "fit-content",
      },

      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "flex-end",
        width: "100%",
        gap: "12px",
      },

      showLessContainer: {
        ...FONT_FAMILY.Inter(600, 14),
        color: primaryColor(500),
        padding: "0px 16px",
        marginBottom: "5px",
        border: `1px solid ${primaryColor(500)}`,
        borderRadius: 6,
        cursor: "pointer",
        minWidth: 120,
        textAlign: "center" as "center",
        backgroundColor: "transparent",
        transition: "all 0.2s ease",
      },
      // showLessContainer: {
      //   ...FONT_FAMILY.Inter(600, 14),
      //   color: primaryColor(500),
      //   padding: "8px 14px",
      //   cursor: "pointer",
      //   minWidth: 104,
      // },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
