import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {secondColor}=useGomakeTheme()
  const classes = useMemo(() => {
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
        minWidth:"fit-content",
        width:"240px",
        height:40,
      },
      btnsContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent:"space-around",
        alignItems:"center",
        width:"100%"
      },
      totalPriceContainer:{ width: 240, alignItems: "center", textAlign: "center"as "center",...FONT_FAMILY.Lexend(600,18) }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
