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
        padding:16
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
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
