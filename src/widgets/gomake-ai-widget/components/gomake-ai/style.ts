import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "row" as "row",
        height: "100%",
        width: "100%",
        backgroundColor: "#F6F6F6",
      },
      mainContentContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        flex: 1,
        height: "100%",
        overflow: "hidden",
      },
      priceWidgetContainer: {
        flex: 1,
        height: "100%",
        backgroundColor: "#f6f6f6",
        overflow: "auto",
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
