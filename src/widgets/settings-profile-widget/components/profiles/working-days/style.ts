import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor} = useGomakeTheme();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
 
  const classes = useMemo(() => {
    return {
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 14),
        display: 'flex',
        alignItems: 'flex-end',
      },
      formControlStyle: {
         m: 1,
        width: "auto",
        minWidth:"180px",
        height:"40px",
      },
      chipStyle:{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5
      },
      paperStyle:{
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };