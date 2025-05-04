import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainBox: {
        backgroundColor: "#fff",
        padding: 1,
        borderRadius: 4,
        maxWidth: 800,
        margin: "auto",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        overflow: "hidden",
      },
    };
  }, []);

  return { classes };
};
export { useStyle };
