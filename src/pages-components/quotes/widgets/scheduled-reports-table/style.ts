import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "900px",
        height: "580px",
        padding: "10px",
        borderRadius: "4px",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "20px",
      },
      actionButtons: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "center",
      },
      buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
      },
      closeButton: {
        backgroundColor: "rgb(236,3,141)",
        width:"fit-content",
        minWidth:100,
        height:40,
        color: "white",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };