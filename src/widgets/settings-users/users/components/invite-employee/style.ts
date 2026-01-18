import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex" as "flex",
        flexDirection: "column" as "column",
        maxHeight: "fit-content",
        position: "relative" as "relative",
      },
      contentContainer: {
        flex: 1,
        minHeight: 0,
      },
      btnContainer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        padding: "15px 20px",
        backgroundColor: "#fff",
        borderTop: "1px solid #D0D5DD",
      },
      actionBtn: {
        backgroundColor: secondColor(500),
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: secondColor(700),
        },
        "&:disabled": {
          backgroundColor: "#ccc",
          color: "#666",
        },
        textTransform: "capitalize",
      },
      cancelBtn: {
        backgroundColor: "#f5f5f5",
        color: "#666",
        "&:hover": {
          backgroundColor: "#e0e0e0",
        },
        textTransform: "capitalize",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
