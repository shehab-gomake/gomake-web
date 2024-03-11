import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {primaryColor}=useGomakeTheme()
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        gap: 20,
        padding:20,
        overflow: "scroll" as "scroll",
      },
      tableTitleContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 10,
        marginTop:15
      },
      titleStyle:{
        ...FONT_FAMILY.Lexend(700,14),
        color:primaryColor(500),
        paddingLeft:5
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
