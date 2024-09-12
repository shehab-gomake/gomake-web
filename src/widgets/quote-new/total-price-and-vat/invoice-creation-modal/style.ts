import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "fit-content",
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "center"
      },
      titleContainer:{
        ...FONT_FAMILY.Lexend(700,16),
        marginTop:15,
        color:"#2E3092"
      },
      btnsContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap:10,
        marginTop: 30
      },
      btnStyle:{
        width:"23%",
        minWidth:"fit-content",
        height:40
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
