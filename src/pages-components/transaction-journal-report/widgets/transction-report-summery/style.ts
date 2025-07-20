import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      skeltonStyle: {
        width: "180px",
        height: "100%",
        borderRadius: "8px",
      },
      rowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
