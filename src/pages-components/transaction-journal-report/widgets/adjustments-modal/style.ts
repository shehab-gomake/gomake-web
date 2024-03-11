import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {secondColor}=useGomakeTheme()
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "50%",
        borderRadius: 5,
        height: "auto",
        maxHeight: 750,
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        padding: "20px 0px",
        gap:10
      },
      btnContainer:{
        width:220,
        height:40,
        backgroundColor:secondColor(500)
      },
      btnsContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent:"space-between",
        alignItems:"center",
        width:"100%"
      },
      totalPriceContainer:{ width: 240, alignItems: "center", textAlign: "center"as "center",...FONT_FAMILY.Lexend(600,18) }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
