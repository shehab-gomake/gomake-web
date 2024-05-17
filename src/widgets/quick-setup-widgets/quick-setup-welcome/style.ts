import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer:{
        display: 'flex',
        flexDirection: 'row' as "row",
        justifyContent: 'space-between',
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding:10,
        backgroundColor:"#FFF",
        gap:26
      },
      leftSide:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'center',
        alignItems: "center",
        width: "50%",
        paddingLeft:"6%",
        paddingRight:"6%",

      },
      itemColumnContainer:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'center',
        alignItems: "flex-start",
      },
      mainItemContainer:{ 
        display: "flex", 
        flexDirection: "row" as "row", 
        justifyContent: "flex-start", 
        alignItems: "flex-start", 
        gap: 12 
      },
      titleListStyle:{
        ...FONT_FAMILY.Lexend(700,20),
        color:"#000"
      },
      descriptionListStyle:{
        ...FONT_FAMILY.Lexend(400,16),
        color:"#000",
        marginBottom:35
      },
      rightSide:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'center',
        alignItems: "flex-start",
        width: "50%",
        height:"100%",
        backgroundColor:"#F9F9F9",
        borderRadius:43,
        paddingLeft:"6%",
        paddingRight:"6%",
      },
      welcomeTextStyle:{
        marginTop: 13,
        ...FONT_FAMILY.Lexend(700,32),
        color:"#000"
      },
      subTitleTextStyle:{
        ...FONT_FAMILY.Lexend(400,24),
        color:"#000"
      },
      descriptionTextStyle:{
        marginTop: 24,
        marginBottom:24,
        ...FONT_FAMILY.Lexend(400,20),
        color:"#000",
      },
      btnContainer:{
        width:242,
        height:54,
        borderRadius:10
      }

    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
