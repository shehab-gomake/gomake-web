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
   
      searchContainer:{
        display:"flex",
        flexDirection:"row" as "row",
        gap:10
      },
      searchInputStyle:{
        border:"1px solid #D0D5DD",
        backgroundColor:"transparent"

      },
      filtersBtn:{
        width:"fit-content",
        height: 40,
        borderRadius:10,
        backgroundColor:"transparent",
        border:"1px solid #E0E0E0",
        color:"#182230",
        ...FONT_FAMILY.Lexend(500,14)
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
