import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      stepLabelContainer: {
        display: 'flex',
        alignItems: 'center' as 'center',
        gap: '5px',
        ...FONT_FAMILY.Lexend(500, 16),
        color: 'blue'
      },
      stepLabel: {
        display: 'flex',
        justifyContent: 'space-between' as 'space-between'
      },
      activeStepLabel: {
        backgroundColor: primaryColor(50),
        padding: 10,

      },
      stepContainer: {
        border: 0,
        padding: 0,
        margin: 0
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
