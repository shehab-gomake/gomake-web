import { useGomakeTheme } from "@/hooks/use-gomake-thmem";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        backgroundColor: primaryColor(100),
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
