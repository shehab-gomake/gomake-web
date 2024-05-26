import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
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
        height: "400px",
        maxHeight: 400,
        backgroundColor: "#F7F7F7",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
