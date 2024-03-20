import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        width: '100%',
        padding: '16px 0',
        gap: 16
      },
      inputsRow: {
        display: 'flex',
        alignItems: 'center' as 'center',
        gap: '16px',
        flexWrap: 'wrap' as 'wrap'
      },
      inputs: {
        boxSizing: 'border-box' as 'border-box',
        borderRadius: '4px',
        height: '40px',
        padding: '6.5px 14px'
      },
      button: {
        width: 'fit-content' as 'fit-content',
        height: '40px'
      },
      deleteIcon: {
        cursor: 'pointer',
        alignSelf: 'flex-end'
      },
      addColor: {
        display: 'flex',
        justifyContent: "flex-end",
        alignItems: "flex-end",
        alignSelf: 'flex-end',
        height: 85
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 10,
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 14),
        display: 'flex',
        gap: 3
      },
      input: {
      },
      multiInputLabel: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),

      },
      multiInputContainer: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: 16,
        width: '100%'
      },
      iconColor: secondColor(500),
      required: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500)
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
