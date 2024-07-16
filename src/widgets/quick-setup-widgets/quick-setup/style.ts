import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useEffect, useMemo, useState } from "react";

const useStyle = () => {
  const {theme, primaryColor } = useGomakeTheme();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        // justifyContent: 'center',
        justifyContent: screenHeight > 788 ? 'center' : 'flex-start',
        alignItems: "center",
        width: "50%",
        height:"100%",
        overflow: "scroll" as "scroll",
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