import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      menuItemStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: primaryColor(300),
      },
      dividerStyle: { margin: 0 },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
