import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = () => {
  const {secondColor}=useGomakeTheme()
  const classes = useMemo(() => {
    return {
      mainContainer:{
        display: 'flex',
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap:10,
        padding:16,
      },
      title:{
        ...FONT_FAMILY.Lexend(500,18)
      },
      buttonContainer:{
        display:"flex",
        flexDirection:"row" as "row",
        gap:10
      },
      printBtn:{
        width:"fit-content",
        height: 40,
        borderRadius:8,
        border:"none"

      },
      
      settingBtn:{
        width:"fit-content",
        height: 40,
        borderRadius:8,
        backgroundColor:"transparent",
        border:"1px solid #E0E0E0"
      },
      menuContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 10,
      },
      menuItemReviewContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 8,
        justifyContent: "flex-start",
        alignItems: "center"
      },
      menuItemReviewText: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#667085",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
