import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = () => {
  const {secondColor}=useGomakeTheme()
  const clasess = useMemo(() => {

    return {
      mainContainer:{
        display: 'flex',
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        gap:10
      },
      headerContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      },
      downloadBtnStyle:{
        height: 40,
        backgroundColor:secondColor(500)
      },
      titleStyle:{
        ...FONT_FAMILY.Lexend(500,16)
      },
      dividerStyle:{ display: "flex", width: "100%", height: 1,  backgroundColor: secondColor(500) }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
