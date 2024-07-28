import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const {theme ,secondColor }=useGomakeTheme()
  const classes = useMemo(() => {
    return {
      insideStyle:{
        width: "550px",
        height: "320px",
        position: "relative",
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap:20
      },
      sendBtn: {
        width: "100%",
        backgroundColor: secondColor(500),
        height: 20,
        padding: 20,
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
