import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = () => {
  const classes = useMemo(() => {

    return {
      mainContainer:{
        display: 'flex',
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap:10,
        padding:16
      },
      parameterContainer:{
        display: 'flex',
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap:10,
      },
      parameterItem:{
        ...FONT_FAMILY.Lexend(400,14),
        color:"#B42318",
        border: "1px solid #FECDCA",
        backgroundColor: "#FECDCA",
        
        borderRadius: 4,
        padding: 4  
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
