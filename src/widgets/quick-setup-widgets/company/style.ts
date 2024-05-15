import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {theme, primaryColor,errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      header: {
        color: primaryColor(600),
        ...FONT_FAMILY.Outfit(600, 24)
      },
      input: {
        height: 40,
        width: 400,
        textAlign: 'flex-start',
       
      },
      nameInput: {
        height: 50,
        width: 180,
        textAlign: 'center'
      },
      nextButton: {
        width: '100%'
      },
      msgTestStyle:{
        display: "flex",
        flexDirection:"row" as "row",
        justifyContent:"flex-start",
        alignItems: "flex-start",
        ...FONT_FAMILY.Lexend(400,12),
        color:errorColor(300)
      }
    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
