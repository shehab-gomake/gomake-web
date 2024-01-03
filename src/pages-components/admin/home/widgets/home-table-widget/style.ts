import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding : "30px 20px 10px 20px",
        backgroundColor: "#FFFFFF",
        margin: "0 4px",
        borderRadius: 8,
        boxShadow:"0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
