import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyleCharacterDetails = ({showAll}) => {
  const clasess = useMemo(() => {
    return {
      mainContainer:{
        height: showAll ? 100 : 74,
        overflowY: "scroll" as "scroll",
        borderRight: showAll ? "1px solid  #F135A3" : "none",
        padding: "16px 24px",
        color: "#000000",
        ...FONT_FAMILY.Inter(400, 14),
      },
      showAllContaner:{
        ...FONT_FAMILY.Inter(500, 14),
        color: "#5859A8",
        textDecoration: "underLine",
        cursor: "pointer",
      },
      textInputEditing:{
        width: "100%",
        borderRadius: 4,
        height: 110,
        overflow: "scroll" as "scroll",
        padding: 5,
        border: "1px solid #ccc",
        color: "#000000",
        ...FONT_FAMILY.Lexend(500, 14),
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyleCharacterDetails };
