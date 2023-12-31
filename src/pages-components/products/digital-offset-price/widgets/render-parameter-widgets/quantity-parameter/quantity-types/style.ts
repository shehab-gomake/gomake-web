import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
const useStyle = () => {
  const { primaryColor, theme } =
    useGomakeTheme();

  const classes = useMemo(() => {
    return {
      duplicateName: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(900)
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
