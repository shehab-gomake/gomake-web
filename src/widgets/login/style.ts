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
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
