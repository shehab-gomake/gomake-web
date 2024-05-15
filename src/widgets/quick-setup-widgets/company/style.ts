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
        width: '100%',
        textAlign: 'flex-start',
        boxShadow:"none",
        border: "1px solid #F2F2F2",
        borderRadius:8,
        backgroundColor:"transparent",
      },
      inputPhone:{
        boxShadow:"none",
        border: "1px solid #F2F2F2",
        borderRadius:8,
        backgroundColor:"transparent",
      },
      dropDownList:{
        height: 40,
        width: '100%',
        textAlign: 'flex-start',
        boxShadow:"none",
        border: "1px solid #F2F2F2",
        borderRadius:8,
        backgroundColor:"transparent",
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
      },
      signUpStyle:{
        ...FONT_FAMILY.Inter(700,40),
        color:"#232323"
      },
      signUpMobileStyle:{
        ...FONT_FAMILY.Inter(700,26),
        color:"#232323"
      },
      subTitleStyle:{
        ...FONT_FAMILY.Inter(400,18), 
        color:"#969696"
      },
      subTitleMobileStyle:{
        ...FONT_FAMILY.Inter(400,14), 
        color:"#969696"
      },
      noteStyle:{
        ...FONT_FAMILY.Inter(400,12),
        color:"#9A9A9A",
        marginTop:-10,
        marginBottom:-10
      }
    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
