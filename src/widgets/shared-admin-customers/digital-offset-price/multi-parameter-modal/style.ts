import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {primaryColor}=useGomakeTheme()
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 444,
        borderRadius: 12,
        height: 747,
        backgroundColor: "#f7f7f7",
        padding:20
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width:"100%",
        height:"100%",
      },
      titleStyle:{
        ...FONT_FAMILY.Lexend(500,14),
        color:primaryColor(900),
        marginBottom:6
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
