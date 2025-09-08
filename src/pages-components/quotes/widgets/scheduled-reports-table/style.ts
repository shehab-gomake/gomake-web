import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "900px",
        height: "620px",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "20px",
        padding: "20px",
      },
      actionButtons: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
      },
      buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
      },
      closeButton: {
        backgroundColor: "#6c757d",
        color: "white",
        "&:hover": {
          backgroundColor: "#5a6268",
        },
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };