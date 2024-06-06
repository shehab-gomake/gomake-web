import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = (isQuoteConfirmation) => {
  const classes = useMemo(() => {
    return {
      writeCommentContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        padding: "14px 29px",
        borderBottom: isQuoteConfirmation ? "none" : "1px solid #67707F",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        flex: 0.1,
        gap:30
      },
      textInputStyle: isQuoteConfirmation ? 
      {
        background: "#FFFFFF",
        boxShadow: "none",
        border: "1px solid #D0D5DD",
        borderRadius:"8px",
        width: "100%",
      }
      :
       {
        height: 44,
        background: "#FFFFFF",
        boxShadow: "none",
        borderRadius:"8px",
        width: "100%",
      },
      autoComplateStyle:{
        background: "#FFFFFF",
        boxShadow: "none",
        border: "none",
        borderRadius:"8px",
        width: "100%",
      },
      itemContainer:{
        width: "20%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap:5
      },
      labelTextStyle:{
        ...FONT_FAMILY.Lexend(500,14),
        color:"#000"
      }
    };
  }, [isQuoteConfirmation]);
  return {
    classes,
  };
};
export { useStyle };
