import { useMemo } from "react";
const useStyle = (isQuoteConfirmation) => {
  const classes = useMemo(() => {
    return {
      writeCommentContainer: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        padding: "14px 29px",
        background: "#F4F1F6",
        borderBottom: isQuoteConfirmation ? "none" : "1px solid #67707F",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
      },
      textInputStyle: {
        height: 44,
        background: "#FFFFFF",
        boxShadow: "none",
      },
    };
  }, [isQuoteConfirmation]);
  return {
    classes,
  };
};
export { useStyle };
