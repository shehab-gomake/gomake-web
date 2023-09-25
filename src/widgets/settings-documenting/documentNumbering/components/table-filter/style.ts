import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: 'flex',
        gap: 8,
        alignItems: 'center' as 'center',
        justifyContent: 'flex-end',

      },
      switchLabel: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(9800),
        minWidth: 'fit-content' as 'fit-content',
        lineHeight: "15px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };