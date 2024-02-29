import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {secondColor}=useGomakeTheme()
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "25%",
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
      date2FilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "100%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      textInputStyle: {
        width: "100%",
        border: "none",
      },
      btnsContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent:"space-between",
        alignItems:"center",
        width:"100%",
        marginTop: 20
      },
      btnContainer:{
        width:150,
        height:40,
        backgroundColor:secondColor(500)
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
