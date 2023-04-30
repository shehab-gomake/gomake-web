import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {

      },
      inputsRow: {
        display: 'flex',
        alignItems: 'center' as 'center',
        gap: '15px'
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
        cursor: 'pointer'
      },
      addColor: {
        alignSelf: 'flex-end',
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 10,
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 15),
      },
      input: {
        // width: "87%",
      },

    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
