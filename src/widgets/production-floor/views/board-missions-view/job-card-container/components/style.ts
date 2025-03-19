import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, grayColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      title: {
        ...FONT_FAMILY.Inter(700, 16),
        color: secondColor(500),
      },
      subTitles: {
        ...FONT_FAMILY.Inter(600, 14),
        color: primaryColor(500),
      },
      propertyName: {
        ...FONT_FAMILY.Inter(400, 14),
        color: primaryColor(900),
      },
      propertyValue: {
        ...FONT_FAMILY.Inter(600, 14),
        color: primaryColor(500),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
