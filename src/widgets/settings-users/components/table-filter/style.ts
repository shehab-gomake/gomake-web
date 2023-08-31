import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: 'flex',
        gap: 10,
        alignItems: 'center' as 'center',
        justifyContent: 'flex-end',

      },
      searchInput: {
        maxWidth: 335,
        height: 40
      },
      switchLabel: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(9800),
        minWidth: 'fit-content' as 'fit-content',
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
