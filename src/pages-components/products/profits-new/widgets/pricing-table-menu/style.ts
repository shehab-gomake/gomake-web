import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      menuItemStyle: {
        ...FONT_FAMILY.Lexend(500, 11),
        color: `var(--theme-text-primary, ${primaryColor(400)})`,
      },
      dividerStyle: { margin: 0 },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
