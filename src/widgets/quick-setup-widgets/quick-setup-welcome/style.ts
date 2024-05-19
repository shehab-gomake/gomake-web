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
        gap: 12 ,
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
      },
      mainMobileContainer:{
        display:"flex",
        flexDirection:"column" as "column",
        justifyContent:"flex-start",
        alignItems:"center",
        width:"100%",
        padding:30,
        backgroundColor:"#FFF",
      },
      firstContainer:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'center',
        alignItems: "center",
        width: "100%",
        backgroundColor:"#F9F9F9",
        borderRadius:16,
        padding:"17px 21px",
        marginBottom:29
      },
      secondContainer:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'center',
        alignItems: "center",
        width: "100%",
      
      },
      welcomeTextStyleMobile:{
        marginTop: 8,
        ...FONT_FAMILY.Lexend(700,20),
        color:"#000"
      },
      subTitleTextStyleMobile:{
        marginTop: 8,
        ...FONT_FAMILY.Lexend(400,16),
        color:"#000",
        textAlign: "center" as "center"
      },
      titleListStyleMobile:{
        ...FONT_FAMILY.Lexend(700,16),
        color:"#000"
      },
      descriptionListStyleMobile:{
        ...FONT_FAMILY.Lexend(400,14),
        color:"#000",
        marginBottom:16
      },
      btnContainerMobile:{
        width:"100%",
        height:54,
        borderRadius:10,
        marginTop:16
      },

    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
