import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      addNewBudgetTabStyle:{
        display: 'flex',
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap:6,
        ...FONT_FAMILY.Lexend(500,14),
        marginBottom:10,
        cursor: "pointer"


      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
