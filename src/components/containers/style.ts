import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import {convertHeightToVH} from "@/utils/adapter";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        gap: 26,
        paddingTop: 20,
        minHeight: "100%",
        maxHeight: convertHeightToVH(750),
        position: 'relative' as 'relative'
      },
      sideList: {
        minWidth: 264,
      },
      main: {
        width: "100%",

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
