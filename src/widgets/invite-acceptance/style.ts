import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
        height: "100vh",
        backgroundColor: "#F5F5F5",
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
