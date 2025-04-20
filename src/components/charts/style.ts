import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      pieContainer: {
        width: 350,
        // margin: "0 auto",
        background: "#f9f9f9",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      },

      pieContainers: {
        width: 350,
        background: "#f9f9f9",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
