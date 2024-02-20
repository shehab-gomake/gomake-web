import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap:10,
        
      },
      statusFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "18%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      inputsForQuotesContainer:{
        display: "flex",
        flexDirection: "row" as "row", 
        justifyContent: "flex-start", 
        alignItems: "center", 
        gap: 20
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
