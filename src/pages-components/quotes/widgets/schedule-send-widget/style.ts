import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const {theme ,secondColor }=useGomakeTheme()
  const classes = useMemo(() => {
    return {
      insideStyle:{
        width: "700px",
        height: "fit-content",
        minHeight: "500px",
        position: "relative",
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        width: "100%",
        gap: 20,
        padding: "20px",
      },
      inputRow: {
        display: "flex",
        gap: "15px",
        alignItems: "flex-end",
      },
      inputContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        gap: "5px",
      },
      labelStyle: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#333",
        marginBottom: "5px",
      },
      buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px",
      },
      sendBtn: {
        backgroundColor: secondColor(500),
        height: 40,
        padding: "10px 20px",
        minWidth: "120px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
