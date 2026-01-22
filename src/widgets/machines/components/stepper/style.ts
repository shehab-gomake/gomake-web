import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const {  primarySecondaryBlend , theme} = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      stepLabelContainer: {
        display: 'flex',
        alignItems: 'center' as 'center',
        gap: '5px',
        ...FONT_FAMILY.Lexend(500, 16),
      },
      stepLabel: {
        display: 'flex',
        justifyContent: 'space-between' as 'space-between',

      },
      activeStepLabel: {
        backgroundColor: primarySecondaryBlend(50),
        padding: 10,
        cursor: 'pointer' as 'pointer'

      },
      stepContainer: {
        border: 0,
        padding: 0,
        margin: 0
      },
      stepLabelText: {
        margin: '0 2px'
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
