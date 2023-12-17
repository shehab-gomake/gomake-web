import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
      },
      headersStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        width: "100%",
        height: "50px",
        alignItems: "center"
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
