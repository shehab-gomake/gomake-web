import { CSSProperties, useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useAccordionStyle = () => {
  const {primaryColor  , theme} = useGomakeTheme();
  const classes = useMemo((): Record<string, CSSProperties> => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      headerTableContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",

        borderRadius: "16px",
        backgroundColor: primaryColor(100),
        cursor: "pointer",
      },
      headerTitleStyle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16,
      },
      iconContainer: {
        display: "flex",
        cursor: "pointer",
      },
      titleStyle: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: "#202020",
      },
      defaultStyle: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: "var(--theme-primary-color, #2E3092)",
      },
      chidrenTableContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        maxHeight: 210,
        padding: "10px 10px",
        overflow: "scroll",
        paddingRight: 0,
        paddingBottom: 0,
      },
    };
  }, [theme]);
  return {
    classes,
    primaryColor,
  };
};
export { useAccordionStyle };
