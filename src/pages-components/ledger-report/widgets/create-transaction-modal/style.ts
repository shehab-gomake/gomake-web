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
        gap:20,
        paddingTop:"20px"
      },
      inputsRowStyle:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap" as "wrap",
        gap:15
      },
      date2FilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "200px",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      textInputStyle: {
        width: "100%",
        border: "none",
        height:40
      },
      createBtnStyle:{
        height: 40,
        background:secondColor(500)
      },
      datePickerinvidualContainer:{ 
        display: "flex",
        background: "#FFF", 
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)", 
        height: 40, 
        width: "100%", 
        paddingLeft: 10,
        cursor: "pointer"
        },
        dateStyle: {
          display: "flex",
          position: "relative" as "relative",
          ...FONT_FAMILY.Lexend(500, 14),
          cursor: "pointer",
          alignItems : "center",
          justifyContent: "center"
        },
        datePickerContainer: {
          width:"50%",
          display: "flex",
          position: "absolute" as "absolute",
          top: 0,
          right: 100,
          visibility: "hidden" as "hidden",
        },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
