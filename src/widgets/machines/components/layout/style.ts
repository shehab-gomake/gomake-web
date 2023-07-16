import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        gap: 26,
        padding: "14px 0",
        maxHeight: '82vh'
      },
      sideList: {
        minWidth: 264,
      },
      main: {
        width: "100%",
        overflow: "auto",
      },
      header: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: primaryColor(500),
        padding: "16px 0 20px 0",
      },
      subHeader: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        paddingBottom: 12,
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
