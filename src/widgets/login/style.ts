import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between" as "space-between",
        width: "100%",
      },
      insideStyle: {
        width: "620px",
        borderRadius: 8,
        gap: "8px",
        height: "300px",
        maxHeight: 400,
        backgroundColor: "#F7F7F7",
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
