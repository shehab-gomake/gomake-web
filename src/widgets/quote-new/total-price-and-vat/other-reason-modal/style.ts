import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "500px",
        borderRadius: 8,
        height: "fit-content",
        maxHeight: "90vh",
      },
      mainModalContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        width: "100%",
        gap: 20,
        marginTop: 10,
        paddingBottom: 10,
      },
      textInputStyle: {
        width: "100%",
        border: "1px solid #E6E6E6",
        borderRadius: 8,
        minHeight: 120,
        maxHeight: 200,
        padding: "12px 16px",
        fontSize: 14,
        fontFamily: "Lexend",
        resize: "vertical" as "vertical",
        transition: "border-color 0.2s ease",
      },
      btnContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 12,
        width: "100%",
        marginTop: 8,
      },
      cancelBtn: {
        height: 40,
        minWidth: 100,
        width: "50%",
        border: "2px solid #DEDEDE",
        color: "#28293D",
        backgroundColor: "transparent",
      },
      sendBtn: {
        height: 40,
        minWidth: 100,
        width: "50%",
        lineHeight: "20px",
      },
    };
  }, [secondColor]);
  return {
    classes,
  };
};
export { useStyle };
