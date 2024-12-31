import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = () => {
  const classes = useMemo(() => {

    return {
      mainContainer:{
        display: 'flex',
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "100%",
        gap:10,
        padding:16,
        position:"relative" as "relative"
      },
      reCalculateContainer:{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:8,
        border:"1px solid #D0D5DD",
        padding:"8px 12px",
        position:"absolute" as "absolute",
        top:10,
        right:10,
        cursor:"pointer",
      },
      parameterContainer:{
        display: 'flex',
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "wrap" as "wrap",
        gap:14,
      },
      parameterItem:{
        ...FONT_FAMILY.Lexend(400,14),
        borderRadius:8,
        padding: 8  ,
        cursor:"pointer"
      },
      menuContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        padding: "2px 8px",
      },
      sectionContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 10
      },
      sectionName: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#101828"
      }

    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
