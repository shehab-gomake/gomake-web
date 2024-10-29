import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      headerFilterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        backgroundColor: "#FFF",
        alignItems: "center",
        gap: "20px",
        padding: "12px 0",
      },
      filtersCardBox: {
        width: "60%",
        maxHeight: "100px",
        maxWidth: "60%",
        overflowX: "scroll",
        overflowY: "scroll",
        display: "flex",
        flexWrap: "nowrap",
        gap: "5px",
        whiteSpace: "nowrap",
        borderRadius: "4px",
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "flex-end",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
