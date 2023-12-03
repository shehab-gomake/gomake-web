import { useMemo } from "react";


import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
const useStyle = () => {
  const { theme, neutralColor, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      detailTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(500)
      },
      detailValue: {
        ...FONT_FAMILY.Inter(500, 14),
        color: primaryColor(900),
      },
      sectionTitle: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 18),
      },
      actionContainer: {
        backgroundColor: '#F9FAFB',
        padding: '0 16px',
        borderRadius: 16,
      },
      actionContainerBorder: '2px solid ' + primaryColor(500),
      toggleActionButton: {
        backgroundColor: primaryColor(50),
        borderRadius: 8,
        height: 40,
        width: 40,
      },
      workFlowContainer: {
        padding: '10px 16px',
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
