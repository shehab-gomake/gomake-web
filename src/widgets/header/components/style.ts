import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { neutralColor, primaryColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      logoutContainer: {
        width: "100%",
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(600),
      },
      menuItem: {
        width: "100%",
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(600),
        gap: "8px",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "16px",
        paddingRight: "16px",
      },

      lineContainer: {
        display: "flex",
        width: "100%",
        height: 1,
        backgroundColor: "#cccccc",
      },
    };
  }, [theme]);

  return {
    classes,
    primaryColor,
  };
};
export { useStyle };
