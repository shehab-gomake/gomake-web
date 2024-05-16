import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {theme, primaryColor,errorColor } = useGomakeTheme();
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
        backgroundColor:"#FFF"
      },
      mainMobileContainer:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'center',
        alignItems: "center",
        width: "100%",
        padding:20,
        backgroundColor:"#FFF"
      },
      leftSide:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'center',
        alignItems: "center",
        width: "50%",

      },
      rightSide:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'center',
        alignItems: "center",
        width: "48%",
        height:"100%",
        backgroundColor:primaryColor(500),
        borderRadius:43
      },
      titleStyle:{
        ...FONT_FAMILY.Inter(500,26),
        color:"#FFF",
        marginTop:45
      },
      joinNowStyle:{
        ...FONT_FAMILY.Inter(500,20),
        color:"#FFF",
        marginTop:20,
        opacity:"50%"
      }

    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
